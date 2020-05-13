const userModel = require('../models/users')
const standardResponse = (_data = {}, res, _status) => {
  const data = {
    success: false,
    message: '',
    ..._data
  }
  const status = _status || 200
  if (status < 300) {
    data.success = true
  }
  res.status(status).send(data)
}

module.exports = {
  getAllUsers: async (req, res) => {
    const data = await userModel.getAllUsers()
    return standardResponse({ message: 'Hello from /users', data }, res)
  },
  createUser: async (req, res) => {
    const { email, password } = req.body
    if (email && password && email !== '' & password !== '') {
      const isExists = await userModel.getUsersByCondition({ email })
      if (isExists.length < 1) {
        const userData = {
          email,
          password,
          verification_code: 123,
          role_id: 1,
          status_id: 1
        }
        const create = await userModel.createUser(userData)
        if (create) {
          const data = {
            id: create,
            ...userData
          }
          return standardResponse({
            message: 'User has been created',
            data
          }, res)
        } else {
          return standardResponse({
            message: 'Failed to create user'
          }, res, 400)
        }
      } else {
        return standardResponse({
          message: 'Email already used',
          data: { email }
        }, res, 400)
      }
    } else {
      return standardResponse({
        message: 'All form must be filled'
      }, res, 400)
    }
  }
}
