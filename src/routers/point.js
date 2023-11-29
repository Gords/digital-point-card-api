const express = require('express')
const router = express.Router()
const Point = require('../models/point')
const auth = require('../middleware/auth')

router.post('/points', auth, async (req, res)=>{
    const point = new Point({
        ...req.body,
        owner: req.user._id
    })

    try {
        await point.save()
        res.status(201).send(point)
    } catch (e) {
        res.status(400).send(e)
    }
})


//GET /points?completed=true or false
//GET /points?limit=10&skip=0
//GET /points?sortBy=createdAt:desc
router.get('/points', auth, async (req, res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    } 

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }

    try {
        await req.user.populate({
            path: 'points',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.points)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/points/:id', auth, async (req, res)=>{
    const _id = req.params.id

    try {
        const point = await Point.findOne({_id, owner: req.user._id})
        if(!point){
            return res.status(404).send()
        }
        res.send(point)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/points/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        const point = await Point.findOne({_id: req.params.id, owner: req.user._id})

        
        if(!point){
            return res.status(404).send()
        }

        updates.forEach((update)=> point[update] = req.body[update])
        await point.save()
        res.send(point)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/points/:id', auth, async (req, res)=>{
    try {
        const points = await Point.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!points){
            return res.status(404).send()
        }
        res.send(points)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router