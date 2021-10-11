var express = require("express");
const {Client} = require('pg')
var bodyParser = require("body-parser");

var router = express.Router();
var jsonParser = bodyParser.json()

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/timer", function(req, res) {
    var data = req.query.user;
    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });
    client.connect()
    .then(() => console.log("Sukses connect mantab"))
    .then(() => client.query("SELECT * from test where nama = $1", [data]))
    .then(results => res.send(results.rows[0].nama.toString()))
    .catch(e => console.log(e))
    .finally(() => client.end(err => {
        console.log('client has disconnected')
        if (err) {
          console.log('error during disconnection', err.stack)
        }
    }))
})

router.post("/add-timer", jsonParser, function(req, res) {
    var user = {};
    console.log('body: ' + JSON.stringify(req.body));
    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });
    // user.id = req.body.id;
    user.name = req.body.name;
    client.connect()
    .then(() => console.log("Sukses connect mantab"))
    .then(() => client.query("INSERT INTO test(nama) VALUES($1)", [user.name]))
    .then(() => client.query("SELECT * FROM test"))
    // .then(results => res.send(results.rows[0].nama.toString()))
    .then(results => console.table(results.rows))
    .catch(e => console.log(e))
    .finally(() => client.end(err => {
        console.log('client has disconnected')
        if (err) {
          console.log('error during disconnection', err.stack)
        }
    }))
})

module.exports = router;