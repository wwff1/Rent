const {Schema, model} = require('mongoose')


const schema = new Schema({
    date: { type: String, required: true},
    auto: [{
        auto: String,
    }],
    description: { type: String, required: true}
})

module.exports = model('Accident', schema)