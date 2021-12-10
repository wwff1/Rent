const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    address: {type: String, required: true, unique: true},
    number: {type: String, required: true, unique: true}
})

module.exports = model('Park', schema)