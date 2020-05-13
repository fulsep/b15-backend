require('dotenv').config()
const { APP_PORT } = process.env

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors('*'))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  const data = {
    success: true,
    message: 'Backend is running well'
  }
  res.status(200).send(data)
})

app.get('*', (req, res) => {
  const data = {
    success: false,
    message: 'Path not found'
  }
  res.status(404).send(data)
})

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
