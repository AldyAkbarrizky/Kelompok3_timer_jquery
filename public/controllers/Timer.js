var Timer = require('../models/Timer')

const getAllTimer = async (req, res) => {
    try {
      Timer.findAll()
        .then(result => res.status(200).json({
            message: 'get all timer sukses',
            data: {
              result
            }
        }))
        .finally(() => {
            console.log("Berhasil mendapatkan")
        })
    } catch (error) {
      return res.send(error.message);
    }
}

const insertTimer = async (req, res) => {
    try {
        Timer.create(req.body)
        .finally(() => {
            console.log("Berhasil insert")
        })
    } catch (error) {
        console.log(error)
    }
}

const insertManyTimer = async (req, res) => {
    try {
        Timer.bulkCreate(req)
        .finally(() => {
            console.log("Berhasil insert many")
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllTimer,
    insertTimer,
    insertManyTimer
}