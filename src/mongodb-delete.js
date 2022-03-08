const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'nodejs-task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log(`Unable to connect to database, error: ${error}`)
    }

    console.log(`Connected successfully: ${client}`)

    const db = client.db(dbName)

    db.collection('users').deleteOne(
        {
            _id: ObjectId.createFromHexString('622379e8695b6be04df844a6')
        }
    ).then((result) => {
        console.log(result)
    }).catch(() => {
        console.log(error)
    })

    db.collection('users').deleteMany(
        {
            age: {$gt: 30}
        }
    ).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })
})