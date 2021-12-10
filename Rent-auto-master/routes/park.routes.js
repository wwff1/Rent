const {Router} = require('express')
const Park = require('../models/Park')
const router = Router()

router.post("/add", async function (req, res) {
    const {name, address, number} = req.body
    console.log(req.body)
    const candidate = await Park.findOne({name, address, number})
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const park = new Park({name, address, number})
    await park.save()});

router.get("/all", function(req, res){
    Park.find((err, park) => {
        if(res.status(200)) {
            console.log("server")
            res.send(park)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Park.deleteOne({
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
    Park.findOne({_id: id}, (err, park) => {
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
    const candidate = await Park.findOneAndUpdate({_id: id}, {name: req.body.name, address: req.body.address, number: req.body.number})
    candidate.save()
    return res.send(candidate);
});

module.exports = router