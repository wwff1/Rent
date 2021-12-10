const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/mark', require('./routes/mark.routes'))

app.use('/api/model', require('./routes/model.routes'))

app.use('/api/class', require('./routes/class.routes'))

app.use('/api/type', require('./routes/type.routes'))

app.use('/api/park', require('./routes/park.routes'))

app.use('/api/client', require('./routes/client.routes'))

app.use('/api/auto', require('./routes/auto.routes'))

app.use('/api/accident', require('./routes/accident.routes'))

app.use('/api/order', require('./routes/order.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const  PORT = config.get('port') || 5000

async function start(){
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log('App has been started...'))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()