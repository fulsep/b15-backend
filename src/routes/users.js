const route = require('express').Router()
const userController = require('../controllers/users')

route.get('/', userController.getAllUsers)
route.post('/', userController.createUser)

module.exports = route
