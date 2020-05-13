require('dotenv').config()
const { APP_URL } = process.env

const qs = require('querystring')
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
    let { page, limit, search, sort } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = search || ''
    sort = parseInt(sort) || 0

    const startData = (page * limit) - limit
    const endData = limit

    const condition = [
      'users.email',
      `${search}%`,
      'users.email',
      sort,
      endData,
      startData
    ]

    const totalData = await userModel.getUsersCount(condition)
    const totalPage = Math.ceil(totalData / limit)
    /**
     * When user set query params on url
     * querystring is parse the req.query object into query params
     */
    const nextQuery = qs.stringify({ ...req.query, ...{ page: page + 1 } })
    const prevQuery = qs.stringify({ ...req.query, ...{ page: page - 1 } })

    const nextLink = page < totalPage ? APP_URL.concat('users?').concat(nextQuery) : null
    const prevLink = page > 1 ? APP_URL.concat('users?').concat(prevQuery) : null
    /**
     * Generating page info for page based on database data
     */
    const pageInfo = {
      page,
      limit,
      totalPage,
      totalData,
      nextLink,
      prevLink
    }
    const data = await userModel.getAllUsers(condition)
    return standardResponse({ message: 'List all users', data, pageInfo }, res)
  },
  createUser: async (req, res) => {
    const { email, password, gender, phone } = req.body
    const isRequired = ['email', 'password', 'full_name', 'gender', 'phone']
    const filled = []
    for (const key in req.body) {
      if (isRequired.includes(key)) {
        filled.push(true)
        if (req.body[key] === '') {
          filled.pop()
        }
      }
    }
    if (filled.length === isRequired.length) {
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
          const userDataDetails = {
            picture: 'null',
            full_name: req.body.full_name,
            gender,
            phone,
            user_id: create
          }
          const createUserDetails = await userModel.createUserDetails(userDataDetails)
          if (createUserDetails) {
            delete userDataDetails.user_id
            const data = {
              id: create,
              ...userData,
              ...userDataDetails
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
  },
  updateUser: async (req, res) => {
    let { id } = req.params
    const { email, password } = req.body
    id = parseInt(id)

    const isExists = await userModel.getUsersByCondition({ id })
    if (isExists.length > 0) {
      if (email && email !== '') {
        const userData = {
          email,
          password
        }
        for (const key in userData) {
          if (!userData[key]) delete userData[key]
        }
        const data = [userData, { id }]
        const update = await userModel.updateUser(data)
        if (update) {
          const data = {
            id,
            ...userData
          }
          return standardResponse({
            message: 'User data has been updated',
            data
          }, res)
        }
      } else {
        return standardResponse({
          message: 'All form must be filled'
        }, res, 400)
      }
    } else {
      return standardResponse({
        message: `User with id ${id} not found`
      }, res, 400)
    }
  },
  deleteUser: async (req, res) => {
    let { id } = req.params
    id = parseInt(id)

    const isExists = await userModel.getUsersByCondition({ id })
    if (isExists.length > 0) {
      const deleteData = {
        deleted_at: new Date()
      }
      const data = [deleteData, { id }]
      const deleteUser = await userModel.updateUser(data)
      if (deleteUser) {
        return standardResponse({
          message: `User with id ${id} has been deleted`
        }, res)
      } else {
        return standardResponse({
          message: 'Failed to delete user'
        }, res, 400)
      }
    }
  }
}
