var Sequelize = require("sequelize")
require('dotenv').config();

const db = new Sequelize(
  `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DATABASE}`,
  { define: { freezeTableName: true } }
)

module.exports = db