var express = require("express");
const { Client } = require('pg')
var bodyParser = require("body-parser");

var router = express.Router();
var jsonParser = bodyParser.json()

router.get("/", function (req, res) {
    res.render("index");
});

var flag = true;

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
            .then(() => client.query("SELECT * from timer"))
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
    console.log('body: ' + JSON.stringify(req.body));
    var formData = {
        state: req.body.state,
        savedTime: req.body.savedTime,
        record: req.body.record,
        timeClosed: req.body.timeClosed,
        counter: req.body.counter,
        prevLap: req.body.prevLap
    }

    timer_data.push(formData);
    console.log(formData);

    if (Object.keys(timer_data).length == req.body.timer_tot) {
        console.log(timer_data);
    }

    // var client = new Client({
    //     user: "twqfiaoc",
    //     password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
    //     host: "satao.db.elephantsql.com",
    //     port: 5432,
    //     database: "twqfiaoc"
    // });
    // // user.id = req.body.id;
    // user.name = req.body.name;
    // client.connect()
    // .then(() => console.log("Sukses connect mantab"))
    // .then(() => client.query("INSERT INTO test(nama) VALUES($1)", [user.name]))
    // .then(() => client.query("SELECT * FROM test"))
    // // .then(results => res.send(results.rows[0].nama.toString()))
    // .then(results => console.table(results.rows))
    // .catch(e => console.log(e))
    // .finally(() => client.end(err => {
    //     console.log('client has disconnected')
    //     if (err) {
    //       console.log('error during disconnection', err.stack)
    //     }
    // }))
})

function waitFor(conditionFunction) {

    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
  
    return new Promise(poll);
  }

module.exports = router;