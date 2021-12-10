const {Router} = require('express')
const Client = require('../models/Client')
const router = Router()

router.post("/add", async function (req, res) {
    const {fio, passport, experience, number} = req.body
    const intExperience = parseInt(experience)
    const candidate = await Client.findOne({fio, passport, intExperience, number})
    if (candidate){
        return res.status(400).json({message: "Такая марка уже существует"})
    }
    const client = new Client({fio, passport, experience, number})
    await client.save()});


router.get("/all", function(req, res){
    Client.find((err, client) => {
        if(res.status(200)) {
            console.log("server")
            res.send(client)
        }
    })
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Client.deleteOne({
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
    Client.findOne({_id: id}, (err, client) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(client);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    console.log(req.body)
    const candidate = await Client.findOneAndUpdate({_id: id}, {
        fio: req.body.fio,
        passport: req.body.passport,
        experience: req.body.experience,
        number: req.body.number
    })
    candidate.save()
    return res.send(candidate);
});

module.exports = router