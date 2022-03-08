const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail, sendDeleteAccountMail } = require('../emails/accounts')

const router = new express.Router()
const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        const allowedFileExt = ['.png', '.jpeg,', '.jpg']

        // With string manipulation
        if (!allowedFileExt.some((ext) => file.originalname.endsWith(ext))) {
            return cb(new Error('File type not supported'))
        }

        // With regex
        if (!/\.(png|jpeg|jpg)$/.test(file.originalname)) {
            return cb(new Error('File type not supported'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    try {
        req.user.avatar = await sharp(req.file.buffer)
            .resize(250, 250)
            .png()
            .toBuffer()

        await req.user.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send(`Upload avatar failed.Error: ${e}`)
    }

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.post('/users', async (req, res) => {

    try {
        const newUser = new User(req.body)
        await newUser.save()
        sendWelcomeMail(newUser.email, newUser.name)
        const token = await newUser.generateAuthToken()
        res.status(201).send({ newUser, token })
    } catch (e) {
        res.status(400).send(`Save user failed.Error: ${e}`)
    }

    // newUser.save()
    //     .then(() => {
    //         res.status(201).send(newUser)
    //     })
    //     .catch((error) => {
    //         res.status(400).send(`Save user failed.Error: ${error}`)
    //     }) 
})

router.post('/users/login', async (req, res) => {

    const reqBody = req.body
    console.log(reqBody.password)

    try {
        const user = await User.findByCredentials(reqBody.email, reqBody.password)
        const token = await user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(`User login failed.Error: ${e}`)
    }
})

router.post('/users/logout', auth, async (req, res) => {

    const logoutUser = req.user
    const logoutToken = req.token
    console.log(logoutToken)

    try {
        logoutUser.tokens = logoutUser.tokens.filter((tokenObj) => tokenObj.token !== logoutToken)

        await logoutUser.save()

        res.status(200).send(logoutToken)
    } catch (e) {
        res.status(500).send(`User logout failed.Error: ${e}`)
    }
})

router.post('/users/logout-all', auth, async (req, res) => {

    const logoutUser = req.user

    try {
        const logoutTokens = logoutUser.tokens
        logoutUser.tokens = []

        await logoutUser.save()

        res.status(200).send(logoutTokens)
    } catch (e) {
        res.status(500).send(`User logout-all failed.Error: ${e}`)
    }
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

    // try {
    //     const users = await User.find()
    //     res.status(200).send(users)
    // } catch (e) {
    //     res.status(500).send(`Find users failed.Error: ${error}`)
    // }



    // User.find()
    // .then((users) => {
    //     res.status(200).send(users)
    // })
    // .catch((error) => {
    //     res.status(500).send(`Find users failed.Error: ${error}`)
    // }) 
})

router.get('/users/:id', async (req, res) => {

    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (user) {
            return res.status(200).send(user)
        }

        res.status(404).send(`User not found. Requested user id: ${userId}`)
    } catch (e) {
        res.status(500).send(`Find user failed.Error: ${e}`)
    }

    // User.findById(userId)
    //     .then((user) => {
    //         if(user) {
    //             return res.status(200).send(user)
    //         }

    //         res.status(404).send(`User not found. Requested user id: ${userId}`)
    //     })
    //     .catch((error) => {
    //         res.status(500).send(`Find user failed.Error: ${error}`)
    //     }) 
})

router.patch('/users/me', auth, async (req, res) => {

    const user = req.user
    const updUserObject = req.body
    const userId = user.id

    try {
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const updates = Object.keys(updUserObject)
        const isValidOp = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOp) {
            return res.status(400).send({ error: 'Invalid Update Operation' })
        }

        updates.forEach((update) => user[update] = updUserObject[update])
        await user.save()

        return res.status(200).send(user)
    } catch (e) {
        res.status(500).send(`Update user: ${userId} failed.Error: ${e}`)
    }
})

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove()
        sendDeleteAccountMail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(`Delete user failed.Error: ${e}`)
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    try {
        req.user.avatar = undefined
        await req.user.save()

        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(`Delete user failed.Error: ${e}`)
    }
})

router.get('/user/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router