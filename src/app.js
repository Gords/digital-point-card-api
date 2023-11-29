require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const pointRouter = require('./routers/point')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(pointRouter)

module.exports = app