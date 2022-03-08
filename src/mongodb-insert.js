const {MongoClient, ObjectId} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'nodejs-task-manager'

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log(`Unable to connect to database, error: ${error}`)
    }

    console.log(`Connected successfully: ${client}`)

    const db = client.db(dbName)
    db.collection('users').insertOne({
        _id: ObjectId.generate(),
        name: 'Akoca',
        age: 29
    }, (error, result) => {
        if(error) {
            console.log(`Unable to insert. Error: ${error}`)
        }

        console.log(result.insertedId)
    })

    db.collection('users').insertMany([
        {
            name: 'akoca',
            age: 29
        },
        {
            name:'Hkoca',
            age: 27
        }
    ], (error, result) => {
        if(error) {
            console.log(`Unable to insert. Error: ${error}`)
        }

        console.log(result.insertedIds)
    })

    db.collection('tasks').insertMany([
        {
            description: 'Task Descripiton 1',
            completed: true
        },
        {
            description: 'Task Descripiton 2',
            completed: true
        },
        {
            description: 'Task Descripiton 2',
            completed: false
        }
    ], (error, result) => {
        if(error) {
            console.log(`Unable to insert. Error: ${error}`)
        }

        console.log(result.insertedIds)
    })
})