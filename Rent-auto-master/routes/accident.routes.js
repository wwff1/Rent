const {Router} = require('express')
const Accident = require('../models/Accident')
const mongoose = require("mongoose");
const router = Router()

router.post("/add", async function (req, res) {
    const date = req.body.startDate
    const auto = {_id: mongoose.Types.ObjectId(req.body.auto.id), auto: req.body.auto.auto}
    const description = req.body.description
    const candidate = await Accident.findOne({date, auto, description })
    if (candidate){
        return res.status(400).json({message: "Такое происшествие уже существует"})
    }
    const accident = new Accident({date, auto, description})
    await accident.save()
});

router.get("/all", function(req, res){
    Accident.find((err, client) => {
        if(res.status(200)) {
            console.log("server")
            res.send(client)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Accident.deleteOne({
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

router.get("/:id", function(req, res){
    const id = req.params.id
    Accident.findOne({_id: id}, (err, park) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(park);
        }
    })
});

router.put("/edit", async function(req, res){
    console.log(req.body)
    const id = req.body.id
    const date = req.body.date
    const auto = {_id: req.body.auto[0], auto: req.body.auto[1]}
    const description = req.body.description
    const candidate = await Accident.findOneAndUpdate({_id: id}, {date: date, auto: auto, description: description})
    candidate.save()
    return res.send(candidate);
});

module.exports = router