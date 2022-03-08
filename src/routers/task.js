const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })

    await newTask.save()

    try {
        res.status(201).send(newTask)
    } catch (e) {
        res.status(400).send(`Save task failed.Error: ${e}`)
    }

    // newTask.save()
    //     .then(() => {
    //         res.status(201).send(newTask)
    //     })
    //     .catch((error) => {
    //         res.status(400).send(`Save task failed.Error: ${error}`)
    //     }) 
})

router.get('/tasks', auth, async (req, res) => {

    //const tasks = await Task.find({ owner: req.user._id })
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        const tasks = req.user.tasks

        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(`Find tasks failed.Error: ${e}`)
    }

    // Task.find()
    //     .then((tasks) => {
    //         res.status(200).send(tasks)
    //     })
    //     .catch((error) => {
    //         res.status(500).send(`Find tasks failed.Error: ${error}`)
    //     }) 
})

router.get('/tasks/:id', auth, async (req, res) => {

    const taskId = req.params.id

    const task = await Task.findOne({ _id: taskId, owner: req.user._id })

    try {
        if (task) {
            return res.status(200).send(task)
        }

        res.status(404).send(`Task not found. Requested task id: ${taskId}`)
    } catch (e) {
        res.status(500).send(`Find task failed.Error: ${e}`)
    }

    // Task.findById(taskId)
    //     .then((task) => {
    //         if(task) {
    //             return res.status(200).send(task)
    //         }

    //         res.status(404).send(`Task not found. Requested task id: ${taskId}`)
    //     })
    //     .catch((error) => {
    //         res.status(500).send(`Find task failed.Error: ${error}`)
    //     }) 
})

router.patch('/tasks/:id', async (req, res) => {

    const taskId = req.params.id
    const reqBody = req.body

    try {
        const allowedUpdates = ['description', 'completed']
        const updates = Object.keys()
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({ error: 'Invalid Update Operation' })
        }

        //const task = await Task.findById(taskId)
        const task = await Task.findOne({ _id: taskId, owner: req.user._id })

        if (!task) {
            res.status(404).send(`Task not found. Requested task id: ${taskId}`)
        }

        updates.forEach((update) => task[update] = reqBody[update])
        await task.save()

        return res.status(200).send(task)
    } catch (e) {
        res.status(500).send(`Update task: ${taskId} failed.Error: ${e}`)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    const taskId = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id})

        if (task) {
            return res.status(200).send(task)
        }

        res.status(404).send(`Task not found. Requested task id: ${taskId}`)
    } catch (e) {
        res.status(500).send(`Delete task failed.Error: ${e}`)
    }
})

module.exports = router