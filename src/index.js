const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('./db/mongoose') //For executing file and connecting to db

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server listening on ${port}`)
})
