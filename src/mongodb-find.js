const {MongoClient, ObjectId} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'nodejs-task-manager'

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log(`Unable to connect to database, error: ${error}`)
    }

    console.log(`Connected successfully: ${client}`)

    const db = client.db(dbName)

    db.collection('users').findOne({
        name: 'Akoca',
        age: 29
    }, (error, user) => {
        if(error) {
            return console.log(`Unable to find document. Error: ${error}`)
        }

        console.log(user)
    })

    db.collection('users').findOne({
        _id: ObjectId.createFromHexString('622350c9aebe26bfa7813522'),
    }, (error, user) => {
        if(error) {
            return console.log(`Unable to find document. Error: ${error}`)
        }

        console.log(user)
    })

    const usersCursor = db.collection('users').find({name: 'Akoca'})
    usersCursor.toArray((error, users) => {
        users.forEach((user) => {console.log(user)})
    })
    usersCursor.count((error, count) => console.log(count))


    db.collection('tasks').findOne({
        _id: ObjectId.createFromHexString('622379e8695b6be04df844a8'),
    }, (error, task) => {
        if(error) {
            return console.log(`Unable to find document. Error: ${error}`)
        }

        console.log(task)
    })

    const tasksCursor = db.collection('tasks').find({completed: true})

    tasksCursor.toArray((error, tasks) => {
        tasks.forEach((task) => {console.log(task)})
    })

    tasksCursor.count((error, count) => console.log(count))
})