'use strict';

var jk = require('../lib/index.js'),
    assert = require("assert");

var PEM_KEY = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
        'MIIBqjCBsAYJKoZIhvcNAQUNMIGiMEMGCSqGSIb3DQEFDDA2BCAxpY3BRimBGJz2' +
        'xwHidsdVOlq19uNthBjkqkDJMM84dgICJxAwDgYKKoYkAgEBAQEBAgUAMFsGCyqG' +
        'JAIBAQEBAQEDMEwECEuxD1wpRdSeBECp1utF8TxwgoDElnsjH16t9ljrpMA3KR04' +
        '2WvwJcpOF/jpcg3GFbQ6KJdfC8Heo2Q4tWTqLBef0BI+bbj6xXkEBIH0KaIuKVHm' +
        'MuHkRK449SHIkP9jd/wFORE6ZnIL/E6RB8VmoH4+q5rmfzN+2cZsAhNj55UIqf36' +
        'CeeId9++dlQxYNyDGVQnqcf/L29A2ND+omWDxy725eIEXalRKmH7wrlXPosL3I8D' +
        'TYzaOspjt4yYd/p1wih1a+dgg6I1JHoJTB7ymW/7/LRebRSAezjiaoYmEDUTHexj' +
        's3MHtE7ywOr+UTks2KK4tQ/G+LyLGmLv0nbU6BuzWPSTG6qjZgwMC131LlIz2Q0f' +
        'TvUgPEDwNs9ZEpFGYL8oISybP9kUHLibk8E1It6zMIWiXMECtbfbo3cHimReiA==\n' +
        '-----END ENCRYPTED PRIVATE KEY-----';

var PEM_KEY2 = '-----BEGIN PRIVATE KEY-----\n' +
'MIIDiAIBADCByQYLKoYkAgEBAQEDAQEwgbkwdTAHAgIBAQIBDAIBAAQhEL7j22rq' +
'nh+GV4xFwSWU/5QjlKfXOPkYfmUVAXKU9M4BAiEAgAAAAAAAAAAAAAAAAAAAAGdZ' +
'ITrxgumH0+F3FJB9Rw0EIbYP0tjc6Kk0I8YQG8qRxHoAfmwwCybNVWybDn0g7ykq' +
'AARAqdbrRfE8cIKAxJZ7Ix9erfZY66TANykdONlr8CXKThf46XINxhW0OiiXXwvB' +
'3qNkOLVk6iwXn9ASPm24+sV5BAQgERERERERERERERERERERERERERERERERERER' +
'ERERERGgggKTMDIGDCsGAQQBgZdGAQECATEiBCARERERERERERERERERERERERER' +
'ERERERERERERERERETAyBgwrBgEEAYGXRgEBAgUxIgQgERERERERERERERERERER' +
'EREREREREREREREREREREcAwSQYMKwYBBAGBl0YBAQIDMTkDNwMRERERERERERER' +
'EREREREREREREREREREREREREREREREREREREREREREREREREREREREREREwggFZ' +
'BgwrBgEEAYGXRgEBAgIxggFHMIIBQzCBvDAPAgIBrzAJAgEFAgEDAgEBAgEBBDYD' +
'zhBJD2pwj8Jt/ow9J8T5TmkBNNW/+YjY0oqurt6XWTbGa6xTaxiuLcMSykkxF9qk' +
'acZAyvMCNj///////////////////////////////////7oxdUWACajApyTwL4Gq' +
'ih/Lr4DZDHqVEQUEzwQ2GmK6edmBM6Fruuftmo4Dwy4IJNV673L4iYaHTlquScJ7' +
'7UmiqVBYBoQmwhcemf07Q8WUfIV8BECp1utF8TxwgoDElnsjH16t9ljrpMA3KR04' +
'2WvwJcpOF/jpcg3GFbQ6KJdfC8Heo2Q4tWTqLBef0BI+bbj6xXkEBECp1utF8Txw' +
'goDElnsjH16t9ljrpMA3KR042WvwJcpOF/jpcg3GFbQ6KJdfC8Heo2Q4tWTqLBef' +
'0BI+bbj6xXkEMIGABgwrBgEEAYGXRgEBAgYxcDBuBEARERERERERERERERERERER' +
'ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER' +
'BAgREREREREREQQgERERERERERERERERERERERERERERERERERERERERERE=\n' +
'-----END PRIVATE KEY-----' ;

describe('Keycoder', function () {
    var keycoder = new jk.Keycoder();
    var base_257 = new jk.Big('2a29ef207d0e9b6c55cd260b306c7e007ac491ca1b10c62334a9e8dcd8d20fb6', 16);

    var check_257 = function (key) {
        assert.equal(key.type, 'Priv');
        assert.equal(key.curve.m, 257);
        assert.equal(key.curve.ks, '12');
        assert.equal(key.curve.a.toString(16), '0');
        assert.equal(key.curve.b.toString(16), '1cef494720115657e18f938d7a7942394ff9425c1458c57861f9eea6adbe3be10');
        assert.equal(key.curve.order.toString(16), '800000000000000000000000000000006759213af182e987d3e17714907d470d');
        assert.equal(key.curve.base.toString(16), '<Point x:2a29ef207d0e9b6c55cd260b306c7e007ac491ca1b10c62334a9e8dcd8d20fb7, y:10686d41ff744d4449fccf6d8eea03102e6812c93a9d60b978b702cf156d814ef >');
        assert.equal(key.d.toString(16), '1111111111111111111111111111111111111111111111111111111111111111');

    };

    var check_431 = function (key) {

        assert.equal(key.type, 'Priv');
        assert.equal(key.curve.m, 431);
        assert.equal(key.curve.ks.toString(), [5, 3, 1]);
        assert.equal(key.curve.a.toString(16), '1');
        assert.equal(key.curve.b.toString(16), '3ce10490f6a708fc26dfe8c3d27c4f94e690134d5bff988d8d28aaeaede975936c66bac536b18ae2dc312ca493117daa469c640caf3');
        assert.equal(key.curve.order.toString(16), '3fffffffffffffffffffffffffffffffffffffffffffffffffffffba3175458009a8c0a724f02f81aa8a1fcbaf80d90c7a95110504cf');
        assert.equal(key.curve.base.toString(16), '<Point x:1a62ba79d98133a16bbae7ed9a8e03c32e0824d57aef72f88986874e5aae49c27bed49a2a95058068426c2171e99fd3b43c5947c857d, y:70b5e1e14031c1f70bbefe96bdde66f451754b4ca5f48da241f331aa396b8d1839a855c1769b1ea14ba53308b5e2723724e090e02db9 >');
        assert.equal(key.d.toString(16), '888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888');

    };

    describe('#parse()', function() {
        it("should parse encrypted key in PEM format", function () {
            var der = keycoder.maybe_pem(PEM_KEY),
                key_store = keycoder.parse(der);
            assert.equal(key_store.format, 'PBES2');
        });

        it("should parse raw key in PEM format", function () {
            var der = keycoder.maybe_pem(PEM_KEY2),
                store = keycoder.parse(der);

            assert.equal(store.format, 'privkeys')
            check_257(store.keys[0]);
            check_431(store.keys[1]);

            store = jk.Priv.from_asn1(der);
            assert.equal(store.format, 'privkeys')
            check_257(store.keys[0]);
            check_431(store.keys[1]);
        })
    });
});