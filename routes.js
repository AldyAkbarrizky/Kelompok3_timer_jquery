var express = require("express");
const { Client } = require('pg')
var bodyParser = require("body-parser");
const { json } = require("body-parser");

var router = express.Router();
var jsonParser = bodyParser.json()

router.get("/", function (req, res) {
    res.render("index");
});

var flag = true;

router.get("/count-timer", function (req, res) {
    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });

    client.connect()
        .then(() => console.log("Berhasil terhubung ke database"))
        .then(() => client.query("Select Count(id) from timer_table"))
        .then(result => res.send(result.rows[0].count))
        .catch(e => console.log(e))
        .finally(() => client.end(() => {
            console.log("Client terputus dari koneksi")
        }))
})

router.post("/new-timer", jsonParser, function (req, res) {
    var timer = req.body.timer_id;
    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });

    client.connect()
        .then(() => console.log("Berhasil terhubung ke database"))
        .then(() => client.query("INSERT INTO timer_table(timer_id) VALUES($1)", [timer]))
        .then(() => client.query("SELECT * from timer_table"))
        .then(results => {
            console.table(results.rows)
            res.send(results.rows)
        })
        .catch(e => console.log(e))
        .finally(() => client.end(() => {
            console.log("Client terputus dari koneksi")
        }))
})

router.delete("/delete-all", function(req, res) {
    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });

    client.connect()
        .then(() => console.log("Berhasil terhubung ke database"))
        .then(() => client.query("DELETE FROM timer_table"))
        .then(results => {
            console.log(results)
            res.send(results)
        })
        .catch(e => console.log(e))
        .finally(() => client.end(() => {
            console.log("Client terputus dari koneksi")
        }))
})

router.get("/timer", function (req, res) {
    var data = req.query.user;
    var id = parseInt(data.charAt(6));
    console.log(id);

    console.log(flag);
    if (flag === true) {
        flag = false;
        console.log(flag);
        var client = new Client({
            user: "twqfiaoc",
            password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
            host: "satao.db.elephantsql.com",
            port: 5432,
            database: "twqfiaoc"
        });
        client.connect()
            .then(() => console.log("Sukses connect mantab"))
            // .then(() => client.query("SELECT * from timer_table WHERE timer_id=$1", [data]))
            .then(() => client.query("SELECT * FROM timer_table ORDER BY id ASC"))
            .then(results => res.send(results.rows))
            .catch(e => console.log(e))
            .finally(() => client.end(err => {
                flag = true;
                console.log('client has disconnected')
                if (err) {
                    console.log('error during disconnection', err.stack)
                }
            }))
    }
    else {
        waitFor(_ => flag === true)
            .then(_ => res.send(data));
    }
})

var timer_data = [];

router.post("/add-timer", jsonParser, function (req, res) {
    var user = {};
    var data = {
        id: req.body.id,
        state: req.body.state,
        savedTime: req.body.savedTime,
        record: req.body.record,
        timeClosed: req.body.timeClosed,
        counter: req.body.counter,
        prevLap: req.body.prevLap
    }

    // timer_data.push(formData);
    console.log(data);

    // if (Object.keys(timer_data).length == req.body.timer_tot) {
    //     console.log(timer_data);
    // }

    var client = new Client({
        user: "twqfiaoc",
        password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
        host: "satao.db.elephantsql.com",
        port: 5432,
        database: "twqfiaoc"
    });
    client.connect()
    .then(() => console.log("Sukses connect mantab"))
    .then(() => client.query("UPDATE public.timer_table SET counter = $1, lap_string = $2, state = $3, prev_lap = $4, savedtime = $5, closedTime = $6 WHERE timer_id = $7", [data.counter, data.record, data.state, data.prevLap, data.savedTime, data.timeClosed, data.id]))
    .then(() => client.query("SELECT * FROM timer_table ORDER BY id ASC"))
    .then(results => console.table(results.rows))
    .catch(e => console.log(e))
    .finally(() => client.end(err => {
        console.log('client has disconnected')
        if (err) {
          console.log('error during disconnection', err.stack)
        }
    }))
})

function waitFor(conditionFunction) {

    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
  
    return new Promise(poll);
  }

module.exports = router;