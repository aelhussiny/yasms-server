const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const bodyParser = require('body-parser');
const NodeRSA = require('node-rsa');

let servercommunicationkey = new NodeRSA().generateKeyPair(1024);
let serversigningkey = new NodeRSA().generateKeyPair(1024);

const app = express()
const timetolive = 5000

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const db = new sqlite3.Database('./db/yasms-server.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
});

const createUserKeysTableSQL = "CREATE TABLE IF NOT EXISTS USERKEYS (username TEXT PRIMARY KEY, key TEXT NOT NULL, address TEXT NOT NULL, lastupdated TEXT NOT NULL)";
const createIdentitiesTableSQL = "CREATE TABLE IF NOT EXISTS IDENTITIES (identityname TEXT PRIMARY KEY, username TEXT NOT NULL, CONSTRAINT fk_username FOREIGN KEY (username) REFERENCES USERKEYS(username) ON DELETE CASCADE)";

db.run(createUserKeysTableSQL, (err1) => {
    if (err1) {
        return console.error(err1.message);
    } else {
        db.run(createIdentitiesTableSQL, (err2) => {
            if (err2) {
                return console.error(err2.message);
            } else {
                db.run("PRAGMA foreign_keys = ON;", (err3) => {
                    if (err3) {
                        return console.error(err3.message);
                    }
                });
            }
        });
    }
});

app.all('/query', (req, res) => {
    db.all(req.body.query, (err, rows) => {
        res.send({
            err: err,
            rows: rows
        });
    });
});

app.post('/ping', (req, res) => {
    res.send({
        status: "online",
        keys: {
            communication: servercommunicationkey.exportKey('public'),
            signing: serversigningkey.exportKey('public')
        }
    });
});

const sign = (obj) => {
    return serversigningkey.encryptPrivate(JSON.stringify(obj), 'base64');
}

app.post('/register', (req, res) => {
    try {
        const decryptedmessage = JSON.parse(req.body.message);
        const registerstmt = db.prepare("INSERT INTO USERKEYS (username, key, address, lastupdated) VALUES (?, ?, ?, DATETIME('now'))");
        registerstmt.run([decryptedmessage.username, decryptedmessage.key, decryptedmessage.address], (err) => {
            if (err) {
                console.error(err);
                res.status(500);
                res.send(err);
            } else {
                res.send(sign({
                    "status": "success"
                }));
            }
        });
    } catch (err) {
        res.status(500);
        res.send(err);
    }
});

app.all('/requestchat/:identity', (req, res) => {
    let searchstmt = "SELECT * FROM IDENTITIES WHERE identityname = (?)";
    db.get(searchstmt, [req.params.identity], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                searchstmt = "SELECT key, address FROM USERKEYS WHERE username = (?)";
                db.get(searchstmt, [row.username], (err2, row2) => {
                    if (err2) {
                        res.status(500);
                        res.send(err);
                    } else {
                        if (row2) {
                            res.send(sign({
                                "status": "success",
                                "key": row2.key,
                                "address": row2.address
                            }));
                        } else {
                            res.status(404);
                            res.send({
                                "error": "Identity not found",
                                "code": 1
                            });
                        }
                    }
                });
            } else {
                res.status(404);
                res.send({
                    "error": "Identity not found",
                    "code": 1
                });
            }
        }
    });
});

app.post('/searchidentities', (req, res) => {
    const usersearchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.get(usersearchstmt, [req.body.username], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                const username = row.username;
                const publickey = new NodeRSA(row.key);
                try {
                    const decryptedCommand = JSON.parse(publickey.decryptPublic(req.body.command).toString('utf-8'));
                    const now = new Date();
                    if (decryptedCommand.command && decryptedCommand.timestamp && decryptedCommand.command === "searchidentities" && decryptedCommand.timestamp >= now.getTime() - timetolive && decryptedCommand.timestamp < now.getTime()) {
                        const searchstmt = "SELECT I.identityname FROM IDENTITIES I, USERKEYS U WHERE I.username = U.username AND I.username != (?) AND I.identityname LIKE ?";
                        db.all(searchstmt, [username, '%' + decryptedCommand.query + '%'], (err, rows) => {
                            if (err) {
                                res.status(500);
                                res.send({
                                    "error": "Problem with finding identities",
                                    "code": 4
                                });
                            } else {
                                res.send(sign({
                                    "status": "success",
                                    "identities": rows
                                }));
                            }
                        });
                    } else {
                        res.status(403);
                        res.send({
                            "error": "Invalid Command",
                            "code": 3
                        });
                    }
                } catch (error) {
                    res.status(403);
                    res.send({
                        "error": "Incorrect key",
                        "code": 2
                    });
                }
            } else {
                res.status(404);
                res.send({
                    "error": "Username not found",
                    "code": 1
                });
            }
        }
    });
});

app.post('/addidentity', (req, res) => {
    const searchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.get(searchstmt, [req.body.username], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                const username = row.username;
                const publickey = new NodeRSA(row.key);
                try {
                    const decryptedCommand = JSON.parse(publickey.decryptPublic(req.body.command).toString('utf-8'));
                    const now = new Date();
                    if (decryptedCommand.command && decryptedCommand.timestamp && decryptedCommand.command === "addidentity" && decryptedCommand.timestamp >= now.getTime() - timetolive && decryptedCommand.timestamp < now.getTime()) {
                        const insertstmt = db.prepare("INSERT INTO IDENTITIES (identityname, username) values (?, ?)");
                        insertstmt.run([decryptedCommand.identityname, username], (err) => {
                            if (err) {
                                res.status(500);
                                res.send(err);
                            } else {
                                res.send(sign({
                                    "status": "success"
                                }));
                            }
                        });
                    } else {
                        res.status(403);
                        res.send({
                            "error": "Invalid Command",
                            "code": 3
                        });
                    }
                } catch (error) {
                    res.status(403);
                    res.send({
                        "error": "Incorrect key",
                        "code": 2
                    });
                }
            } else {
                res.status(404);
                res.send({
                    "error": "Username not found",
                    "code": 1
                });
            }
        }
    });
});

app.post('/deleteidentity', (req, res) => {
    const searchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.get(searchstmt, [req.body.username], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                const publickey = new NodeRSA(row.key);
                try {
                    const decryptedCommand = JSON.parse(publickey.decryptPublic(req.body.command).toString('utf-8'));
                    const now = new Date();
                    if (decryptedCommand.command && decryptedCommand.timestamp && decryptedCommand.command === "deleteidentity" && decryptedCommand.timestamp >= now.getTime() - timetolive && decryptedCommand.timestamp < now.getTime()) {
                        const deletestmt = db.prepare("DELETE FROM IDENTITIES WHERE identityname = (?)");
                        deletestmt.run([decryptedCommand.identityname], (err) => {
                            if (err) {
                                res.status(500);
                                res.send(err);
                            } else {
                                res.send(sign({
                                    "status": "success"
                                }));
                            }
                        });
                    } else {
                        res.status(403);
                        res.send({
                            "error": "Invalid Command",
                            "code": 3
                        });
                    }
                } catch (error) {
                    res.status(403);
                    res.send({
                        "error": "Incorrect key",
                        "code": 2
                    });
                }
            } else {
                res.status(404);
                res.send({
                    "error": "Username not found",
                    "code": 1
                });
            }
        }
    });
});

app.post('/updateaddress', (req, res) => {
    const searchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.get(searchstmt, [req.body.username], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                const username = row.username;
                const publickey = new NodeRSA(row.key);
                try {
                    const decryptedCommand = JSON.parse(publickey.decryptPublic(req.body.command).toString('utf-8'));
                    const now = new Date();
                    if (decryptedCommand.command && decryptedCommand.timestamp && decryptedCommand.command === "updateaddress" && decryptedCommand.timestamp >= now.getTime() - timetolive && decryptedCommand.timestamp < now.getTime()) {
                        const updatestmt = db.prepare("UPDATE USERKEYS SET address = (?), lastupdated = DATETIME('now') WHERE username = (?)");
                        updatestmt.run([decryptedCommand.address, username], (err) => {
                            if (err) {
                                res.status(500);
                                res.send(err);
                            } else {
                                res.send(sign({
                                    "status": "success"
                                }));
                            }
                        });
                    } else {
                        res.status(403);
                        res.send({
                            "error": "Invalid Command",
                            "code": 3
                        });
                    }
                } catch (error) {
                    res.status(403);
                    res.send({
                        "error": "Incorrect key",
                        "code": 2
                    });
                }
            } else {
                res.status(404);
                res.send({
                    "error": "Username not found",
                    "code": 1
                });
            }
        }
    });
});

app.post('/unregister', (req, res) => {
    const searchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.get(searchstmt, [req.body.username], (err, row) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            if (row) {
                const username = row.username;
                const publickey = new NodeRSA(row.key);
                try {
                    const decryptedCommand = JSON.parse(publickey.decryptPublic(req.body.command).toString('utf-8'));
                    const now = new Date();
                    if (decryptedCommand.command && decryptedCommand.timestamp && decryptedCommand.command === "unregister" && decryptedCommand.timestamp >= now.getTime() - timetolive && decryptedCommand.timestamp < now.getTime()) {
                        const unregisterstmt = db.prepare("DELETE FROM USERKEYS WHERE username = (?)");
                        unregisterstmt.run([username], (err) => {
                            if (err) {
                                res.status(500);
                                res.send(err);
                            } else {
                                res.send({
                                    "status": "success"
                                });
                            }
                        });
                    } else {
                        res.status(403);
                        res.send({
                            "error": "Incorrect key",
                            "code": 3
                        });
                    }
                } catch (error) {
                    res.status(403);
                    res.send({
                        "error": "Incorrect key",
                        "code": 2
                    });
                }
            } else {
                res.status(404);
                res.send({
                    "error": "Username not found",
                    "code": 1
                });
            }
        }
    });
});

const server = http.createServer(app);

server.listen(app.get('port'), () => {
    console.log("Web Server started and listening on port " + app.get('port'));
});