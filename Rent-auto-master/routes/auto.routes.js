const {Router} = require('express')
const Auto = require('../models/Auto')
const mongoose = require("mongoose");
const router = Router()

router.post("/add", async function (req, res) {
    const mark = { _id: mongoose.Types.ObjectId(req.body.mark.id), name: req.body.mark.name}
    const model = {_id: mongoose.Types.ObjectId(req.body.model.id), name: req.body.model.name}
    const body = {_id: mongoose.Types.ObjectId(req.body.type.id), name: req.body.type.name}
    const clas = {_id: mongoose.Types.ObjectId(req.body.clas.id), name: req.body.clas.name}
    const park = {_id: mongoose.Types.ObjectId(req.body.park.id), name: req.body.park.name, address: req.body.park.name, number: req.body.park.name}
    const sum = parseFloat(req.body.sum)
    const candidate = await Auto.findOne({mark, model, body, clas, park, sum })
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const auto = new Auto({mark, model, body, clas, park, sum })
    await auto.save()
});

router.get("/all", function(req, res){
    Auto.find((err, client) => {
        if(res.status(200)) {
            console.log("server")
            res.send(client)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Auto.deleteOne({
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
    Auto.findOne({_id: id}, (err, park) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(park);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const mark = { _id: req.body.mark[0], name: req.body.mark[1]}
    const model = {_id: req.body.model[0], name: req.body.model[1]}
    const body = {_id: req.body.body[0], name: req.body.body[1]}
    const clas = {_id: req.body.clas[0], name: req.body.clas[1]}
    const park = {_id: req.body.park[0], name: req.body.park[1], address: req.body.park[2], number: req.body.park[3]}
    const sum = req.body.sum
    const candidate = await Auto.findOneAndUpdate({_id: id}, {mark: mark, model: model, body: body, clas: clas, park: park, sum: sum})
    candidate.save()
    return res.send(candidate);
});

module.exports = router