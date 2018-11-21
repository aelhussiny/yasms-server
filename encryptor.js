const NodeRSA = require('node-rsa');

const privatekey = new NodeRSA("-----BEGIN RSA PRIVATE KEY-----\n" +
"MIIEowIBAAKCAQEAxUFBEL3WB5E5rhLkQUnpgAhUNSKBhl1qoZ/8vgPKY4XZV8eU\n" +
"uSEQG+i1lWBNom/XCOk6Nx2myFcoPnnCgoY01GyPOjSa6Iz5hvo3A+V9zyeCtLIQ\n" +
"UGb8e00GjGpiIGWo/AOEKEzHUYvgCKOPc87oQrjIrFY4J59R3KNXTCOLshB26Q1p\n" +
"UtWraHAd7mvFAlp5G5DnEsOdy9WYJwZqI89oJ97f34uKQ7iR8ivnLNzwLik6/D4I\n" +
"Xj/RQnLSg07j7HwV4vROAmZZzUXJuQvzQktq/zVnA+99F0bh3V+y2mfL02L2XTeR\n" +
"/S6HyWaGwc9XL6pW8+ajWFHnzozvYF6Eg0AZ0wIDAQABAoIBAGqjWm+YkWrJ4irv\n" +
"X6LEOI3U8uE+5FMlkY4LFfILzpB7PgKsjQSAkVrlNbWpuI7Gc7QHkkdVqmLIa6NK\n" +
"5BL4RvtILS5EXjK2c/e6sZ9To+4n6AuT8CnnYzutaoriwGXPT8nehMXcrCyzt8wz\n" +
"0EvFYd8gUqyIeBdDlFf5nio1VUJPnMhz8stPVfiRlWKMMNexXiaypMQTe5lGDHt8\n" +
"GJEqqv7voA7VBctSkSGt9mzGSqUmRnvepqKxQArSAx0O0K941Ew6bj4GdAQxveya\n" +
"hMJWvBoSeiA8bhKEWsEcD6vkt3LgmciJoIDpItkFPm/cfl3DgO+RBGkRa3pg/WQU\n" +
"6eNDmSECgYEA8P/pSVWVshWXTSd6mQlRaHIlIz2DLepwY42v1sfIfGHKIezqMp3S\n" +
"J8JatI4xgP1V8F0avsLA4+RKdda3jjkZ7rllraQJQkhFAyq2qWpi0HXWTmAvIR2j\n" +
"eCggm7mRnMl1+6ZTkWBSthdZRyb+5MS9/giqYpuAQfLcVH2IqyJv62sCgYEA0YhQ\n" +
"XXC92PufrS7rmRuZyxRhubKYqbU//u5kjKUj7Ev+hgiPISpIiLSg8erOlVwklMiE\n" +
"c93xRd2LCLwgY+O5wbzDt1P35BkdBsnPdknfgsJC0Gw2SrptK0Ta2jP7QWFL2HjB\n" +
"Ziux/DHiiP5Yob4w5eGGTNUcwqkX6scwNi5wzTkCgYEAsaaTmyFhpdLQo2k0sFb0\n" +
"EaACzEVty40Dp/8r3ZGLslSLohJ4WTOJVRGpt2sSBtm4XeTj8Daz5cnFMbRDvq1M\n" +
"9nLoBuXihV+sr7buy1fG24/hmAjC9RBaDhrWXrSeKAtB0206MPHmRqBTiWWvg4eb\n" +
"3gUZRHMISpTx4b5f3ncWNV0CgYBpvWHZFdko1CrLqf8JQC2Hl5yNqvxxwF8wVrv1\n" +
"Yi1TxTIID++zK/R40Lbb/sQMCfkIAH0fP+TPfjL40H+ECVsn0wvty3kw6h+E2nlQ\n" +
"14ztHv260rE/Wv9Ws6PCNDNa1jABaUcoOWrTu5T3z2uJDEL+76XnxjCCZ/UC7Ux+\n" +
"O0d/uQKBgGj3S9tHhzFxutUFmTttnITfOzFgU5JGUexg1Gdcn3I9uHLZGRv+h3dz\n" +
"+kX2sT/0RSN+ZDIDuzt9mPcbaVopWAD594exy2N2nJ4S1IUo22QsMOoZEXYEtzAs\n" +
"k6jcg1qLO9vON8Ht8XYgZOMqfDEbqqLF07JRUbin/2CJYhMmrv1g\n" +
"-----END RSA PRIVATE KEY-----")

const publickey = new NodeRSA("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxUFBEL3WB5E5rhLkQUnp\ngAhUNSKBhl1qoZ/8vgPKY4XZV8eUuSEQG+i1lWBNom/XCOk6Nx2myFcoPnnCgoY0\n1GyPOjSa6Iz5hvo3A+V9zyeCtLIQUGb8e00GjGpiIGWo/AOEKEzHUYvgCKOPc87o\nQrjIrFY4J59R3KNXTCOLshB26Q1pUtWraHAd7mvFAlp5G5DnEsOdy9WYJwZqI89o\nJ97f34uKQ7iR8ivnLNzwLik6/D4IXj/RQnLSg07j7HwV4vROAmZZzUXJuQvzQktq\n/zVnA+99F0bh3V+y2mfL02L2XTeR/S6HyWaGwc9XL6pW8+ajWFHnzozvYF6Eg0AZ\n0wIDAQAB\n-----END PUBLIC KEY-----");

let encrypted = privatekey.encryptPrivate("ahmed", 'base64');
let decrypted = publickey.decryptPublic(encrypted).toString('utf-8');
console.log("ahmed", encrypted, decrypted);