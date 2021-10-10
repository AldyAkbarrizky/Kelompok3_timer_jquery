const {Client} = require('pg')
const client = new Client({
    user: "postgres",
    password: "1234567890",
    host: "localhost",
    port: 5432,
    database: "timer"
})

client.connect()
.then(() => console.log("Sukses connect mantab"))
.then(() => client.query("INSERT INTO public.test VALUES($1, $2)", [2, 'Afdal Ramdan Daman Huri']))
.then(() => client.query("SELECT * from test"))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end())