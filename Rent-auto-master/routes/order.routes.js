const {Router} = require('express')
const Order = require('../models/Order')
const mongoose = require("mongoose");
const router = Router()

router.get("/all", function(req, res){
    Order.find((err, client) => {
        if(res.status(200)) {
            console.log("server")
            res.send(client)
        }
    })
});

router.post("/add", async function (req, res) {
    const date1 = req.body.startDate1
    const date2 = req.body.startDate2
    const auto = {_id: mongoose.Types.ObjectId(req.body.auto.id), auto: req.body.auto.auto}
    const client = {_id: mongoose.Types.ObjectId(req.body.client.id), fio: req.body.client.name}
    const one_day = 1000*60*60*24;
    const days = Math.ceil( (new Date (date2).getTime() - new Date (date1).getTime() ) / one_day);
    const sum = (days + 1) * req.body.auto.sum
    const candidate = await Order.findOne({date1, date2, client, auto, sum })
    if (candidate){
        return res.status(400).json({message: "Такое происшествие уже существует"})
    }
    const order = new Order({date_start: date1, date_end: date2, client, auto, sum})
    await order.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Order.deleteOne({
        _id: id
    }, function(err){
        if (err) {
            console.log(err)
        }
        else {
            return res.send("Removed");
        }
    });
});
//
router.get("/:id", function(req, res){
    const id = req.params.id
    Order.findOne({_id: id}, (err, park) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(park);
        }
    })
});
//
router.put("/edit", async function(req, res){
    console.log(req.body)
    const id = req.body.id
    const date1 = req.body.date_start
    const date2 = req.body.date_end
    const client = {_id: req.body.client[0], fio: req.body.client[1]}
    const auto = {_id: req.body.auto[0], auto: req.body.auto[1]}
    const one_day = 1000*60*60*24;
    const days = Math.ceil( (new Date (date2).getTime() - new Date (date1).getTime() ) / one_day);
    const sum = (days + 1) * req.body.auto[2]
    const candidate = await Order.findOneAndUpdate({_id: id}, {date_start: date1, date_end: date2, client: client, auto: auto, sum: sum})
    candidate.save()
    return res.send(candidate);
});

module.exports = router