const mongoose = require('mongoose')
// const User = require('../models/user')
// const Task = require('../models/task')

const connectionUrl = process.env.MONGODB_URL

mongoose.connect(connectionUrl, {})

// const me = new User({
//     name: 'Akoca',
//     password: 'passwddddd',
//     email: 'akoca@mail.com',
//     age: 29
// })

// me.save()
//     .then((result) => {
//         console.log(result)
//         console.log(me)
//     })
//     .catch((error) => {
//         console.log(`Error: ${error}`)
//     })


// const prayingTask = new Task({
//     description: "Pray before time ends",
//     completed: false
// })

// prayingTask.save()
//     .then((result) => {
//         console.log(result)
//         console.log(prayingTask)
//     })
//     .catch((error) => {
//         console.log(`Error: ${error}`)
//     })
