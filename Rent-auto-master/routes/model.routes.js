const {Router} = require('express')
const Model = require('../models/Model')
const router = Router()

router.get("/all", function(req, res){
    Model.find((err, model) => {
        if(res.status(200)) {
            console.log("server")
            res.send(model)
        }
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Model.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая модель уже существует"})
    }
    const mark = new Model({name})

    await mark.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Model.deleteOne({
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
    Model.findOne({_id: id}, (err, mark) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(mark);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const candidate = await Model.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});


module.exports = router