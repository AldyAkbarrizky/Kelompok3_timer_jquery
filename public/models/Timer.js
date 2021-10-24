var sequelize = require('sequelize')
var db = require('../../db')

const Timer = db.define('Timer', {
    timer_id: {
        type: sequelize.STRING,
        allowNull: false,
        primaryKey: false
    },
    counter: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: false
    },
    lap_string: {
        type: sequelize.TEXT,
        allowNull: false,
        primaryKey: false
    },
    prev_lap: {
        type: sequelize.BIGINT,
        allowNull: false,
        primaryKey: false
    },
    saved_time: {
        type: sequelize.BIGINT,
        allowNull: false,
        primaryKey: false
    },
    time_closed: {
        type: sequelize.BIGINT,
        allowNull: false,
        primaryKey: false
    },
    state: {
        type: sequelize.STRING,
        allowNull: false,
        primaryKey: false
    }
})

module.exports = Timer