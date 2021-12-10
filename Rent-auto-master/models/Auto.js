const {Schema, model} = require('mongoose')
const Float = require('mongoose-float').loadType(require('mongoose'));


const schema = new Schema({
    mark: [{
        name: String,
    }],
    model: [{
        name: String,
    }],
    body: [{
        name: String,
    }],
    clas: [{
        name: String,
    }],
    park: [{
        name: String,
        address: String,
        number: String,
    }],
    sum: { type: Float, required: true}
})

module.exports = model('Auto', schema)