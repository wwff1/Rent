const {Router} = require('express')
const Mark = require('../models/Mark')
const router = Router()

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Mark.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const mark = new Mark({name})
    await mark.save()});

router.get("/all", function(req, res){
    Mark.find((err, mark) => {
        if(res.status(200)) {
            console.log("server")
            res.send(mark)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Mark.deleteOne({
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
    Mark.findOne({_id: id}, (err, mark) => {
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
    const candidate = await Mark.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    return res.send(candidate);
});

module.exports = router