'use strict';
var Keycoder = require('./keycoder'),
    Priv = require('../models/Priv'),
    Message = require('../models/Message'),
    Certificate = require('../models/Certificate'),
    fs = require('fs');

var keycoder = new Keycoder();

var load = function load (ret, algo, keyinfo) {

    if (typeof keyinfo.privPath === 'string') {
        var buf = fs.readFileSync(keyinfo.privPath);
        var store = keycoder.parse(buf);
        if(store.format === 'IIT' || store.format === 'PBES2') {
            if (keyinfo.password) {
                buf = algo.storeload(store, 'XXX');
                store = keycoder.parse(buf);
            } else {
                throw new Error("Specify password for keystore");
            }
        }

        if (store.format !== 'privkeys') {
            throw new Error("Cant load key from " + store.format);
        }
        var paths;
        if (typeof keyinfo.certPath === 'string') {
            paths = [keyinfo.certPath];
        } else {
            paths = keyinfo.certPath || [];
        }
        var certs = paths.map(function (path) {
            var cbuf = fs.readFileSync(path);
            return Certificate.from_asn1(cbuf);
        });
        ret.push({priv: store.keys[0], cert: certs[0]});
        if (store.keys[1]) {
            ret.push({priv: store.keys[1], cert: certs[1]});
        }
        return;
    }

    throw new Error("Cant load key from " + keyinfo);
};

var unwrappable = function (data) {
    var header = data.slice(0, 15).toString();
    if (header.substr(0, 14) === 'TRANSPORTABLE\u0000') {
        return true;
    }
    if (header.substr(3, 7) === '_CRYPT\u0000') {
        return true;
    }
    if (header.substr(3, 6) === '_SIGN\u0000') {
        return true;
    }
    return false;
};

var Box  = function Box (opts) {
    opts = opts || {};
    if (opts.keys) {
        var keys = [];
        opts.keys.map(load.bind(null, keys, opts.algo));
        this.keys = keys;
    }
    
    this.algo = opts.algo || {};
};


Box.prototype.sign = function sign (data, role) {
    var key = this.keyFor('sign', role);
    var msg = new Message({
        type: 'signedData',
        cert: key.cert,
        data: data,
        signer: key.priv,
        hash: this.algo.hash,
    });
    return msg;
};


Box.prototype.encrypt = function encrypt (data, role, forCert) {
    if (forCert === undefined) {
        throw new Error("No recipient specified for encryption");
    }
    var key = this.keyFor('encrypt', role);
    var msg_e = new Message({
        type: 'envelopedData',
        cert: key.cert,
        toCert: forCert,
        data: data,
        crypter: key.priv,
        algo: this.algo,
    });
    return msg_e;
};


Box.prototype.keyFor = function keyFor (op, role) {
    if (op === 'sign') {
        return this.keys[0];
    }

    if (op === 'encrypt') {
        return this.keys[1] || this.keys[0];
    }

    throw new Error("unknown error for " + op);
};

Box.prototype.pipe = function pipe (data, commands, opts) {
    var idx, cmd, msg;
    for (idx=0; idx < commands.length; idx++) {
        cmd = commands[idx];
        if (typeof cmd === 'string') {
            cmd = {op: cmd};
        }
        if (cmd.op === undefined) {
            throw new Error("Broken pipeline element", cmd);
        }
        msg = this[cmd.op](data, cmd.role, cmd.forCert);
        data = msg.as_transport(idx === (commands.length - 1) ? opts : cmd.addCert);
    }

    return data;
};

Box.prototype.unwrap = function (data) {
    var msg;
    var info = {};
    while (unwrappable(data)) {
        msg = new Message(data);
        if (msg.type === 'signedData') {
            data = msg.info.contentInfo.content;
        }
        if (msg.type === 'envelopedData') {
            data = msg.decrypt(this.keyFor('encrypt').priv, this.algo);
        }
    }
    info.content = data;
    return info;
};

module.exports = Box;