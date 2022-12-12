import Thing from '../models/thing.js'
import fs from 'fs'

export const stuffController = {

createThing : (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })

    thing.save()
    .then(() => res.status(201).json( {message: 'Objet enregistré'} ))
    .catch(() => res.status(400).json({error}))
},

modifyThing : (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete thingObject._userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) res.status(401).json({ message: "Not authorized" });
            else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: "Objet modifié !"}))
                    .catch(error => res.status(401).json({error}))
            }
        })
        .catch(error => res.status(400).json(error))
},

getThing : (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
},

getAllThings : (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
},

deleteThing : (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) res.status(401).json({message: "Unauthorized"})
            else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: "Supprimé"}))
                        .catch(err => res.status(401).json({err}))
                })
            }
        })
        .catch(err => res.status(500).json({err}))
},
}