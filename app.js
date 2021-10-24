var express = require("express");
var Sequelize = require("sequelize")
var path = require("path");

var routes = require("./routes");

var app = express();
require('dotenv').config();

const sequelize = new Sequelize(
    `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`,
    { define: { freezeTableName: true } })

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')

    app.listen(process.env.SERVER_PORT, () =>
      console.log(`Server app listening on port ${process.env.SERVER_PORT}!`)
    )
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
})