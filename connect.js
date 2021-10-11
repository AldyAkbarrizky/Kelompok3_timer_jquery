const {Client} = require('pg')
const client = new Client({
    user: "twqfiaoc",
    password: "s1tQGfOrWtqZhJU5oe1q9PTgCzCXevAL",
    host: "satao.db.elephantsql.com",
    port: 5432,
    database: "twqfiaoc"
})

module.exports = client

// client.connect()
// .then(() => console.log("Sukses connect mantab"))
// .then(() => client.query("SELECT * from test"))
// .then(results => console.table(results.rows))
// .catch(e => console.log(e))
// .finally(() => client.end())