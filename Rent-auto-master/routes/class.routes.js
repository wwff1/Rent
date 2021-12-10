const {Router} = require('express')
const Class = require('../models/Class')
const router = Router()

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Class.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const class1 = new Class({name})
    await class1.save()});

router.get("/all", function(req, res){
    Class.find((err, class1) => {
        if(res.status(200)) {
            console.log("server")
            res.send(class1)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Class.deleteOne({
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
    Class.findOne({_id: id}, (err, class1) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(class1);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const candidate = await Class.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router