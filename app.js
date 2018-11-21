const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const bodyParser = require('body-parser');
const NodeRSA = require('node-rsa');

const app = express()

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

const createTableSQL = "CREATE TABLE IF NOT EXISTS USERKEYS (username TEXT PRIMARY KEY, key TEXT NOT NULL)";

db.run(createTableSQL, (err) => {
    if (err) {
        return console.error(err.message);
    }
});

app.post('/register', (req, res) => {
    const registerstmt = db.prepare("INSERT INTO USERKEYS (username, key) VALUES (?, ?)");
    registerstmt.run([req.body.username, req.body.key], (err) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.send({
                "status": "success"
            });
        }
    });
});

app.all('/users', (req, res) => {
    let searchstmt = "SELECT * FROM USERKEYS";
    db.all(searchstmt, (err, rows) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

app.all('/users/:name', (req, res) => {
    let searchstmt = "SELECT * FROM USERKEYS WHERE username = (?)";
    db.all(searchstmt, [req.params.name], (err, rows) => {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            res.send(rows);
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
                    const decryptedUsername = publickey.decryptPublic(req.body.encryptedusername).toString('utf-8');
                    if (decryptedUsername === username) {
                        const unregisterstmt = db.prepare("DELETE FROM USERKEYS WHERE username = (?)");
                        unregisterstmt.run([req.body.username], (err) => {
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