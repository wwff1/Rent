const {Schema, model} = require('mongoose')
const Float = require('mongoose-float').loadType(require('mongoose'));


const schema = new Schema({
    date_start: {type: String,},
    date_end: {type: String,},
    client: [{
        fio: String
    }],
    auto: [{
        auto: String,
    }],
    sum: { type: Float, required: true}
})

module.exports = model('Order', schema)