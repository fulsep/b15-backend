const route = require('express').Router()
const userController = require('../controllers/users')

route.get('/', userController.getAllUsers)

module.exports = route
