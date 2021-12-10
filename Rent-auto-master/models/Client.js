const {Schema, model} = require('mongoose')

const schema = new Schema({
    fio: {type: String, required: true},
    passport: {type: String, required:true},
    experience: {type: Number, required: true},
    number: {type: String, required:true}
})

module.exports = model('Client', schema)