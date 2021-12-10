const {Router} = require('express')
const Type = require('../models/Body_type')
const router = Router()

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Type.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const type = new Type({name})
    await type.save()});

router.get("/all", function(req, res){
    Type.find((err, type) => {
        if(res.status(200)) {
            console.log("server")
            res.send(type)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Type.deleteOne({
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
    Type.findOne({_id: id}, (err, type) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(type);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const candidate = await Type.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router