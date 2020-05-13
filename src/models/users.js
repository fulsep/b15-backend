const db = require('../utils/db')
const mysql = require('mysql')

const queryPromise = (sql, data) => {
  return new Promise((resolve, reject) => {
    const a = db.query(sql, data, (err, results, fields) => {
      if (err) {
        reject(Error(err))
      }
      resolve({ results, fields })
    })
    console.log(a.sql)
  })
}

module.exports = {
  getAllUsers: async (_data = []) => {
    const order = _data[3] ? mysql.raw('DESC') : mysql.raw('ASC')
    _data[3] = order
    const data = _data.length < 6 ? ['email', '%', 'email', order, 5, 0] : _data
    const sql = `
    SELECT users.id as id,
    user_details.picture as picture,
    user_details.full_name as full_name,
    user_details.gender as gender,
    users.email as email,
    users.password as password,
    user_details.phone as phone
    FROM users
    JOIN user_details ON users.id = user_details.user_id
    WHERE ? LIKE ? AND users.deleted_at IS NULL ORDER BY ? ? LIMIT ? OFFSET ?`
    const query = await queryPromise(sql, data)

    return query.results
  },
  createUser: async (data) => {
    const sql = 'INSERT INTO users SET ?'
    const query = await queryPromise(sql, data)

    return query.results.insertId
  },
  createUserDetails: async (data) => {
    const sql = 'INSERT INTO user_details SET ?'
    const query = await queryPromise(sql, data)

    return query.results.insertId
  },
  getUsersByCondition: async (data) => {
    const sql = 'SELECT * FROM users WHERE ?'
    const query = await queryPromise(sql, data)

    return query.results
  },
  getUserDetails: async (data) => {
    const sql = 'SELECT * FROM user_details WHERE ?'
    const query = await queryPromise(sql, data)

    return query.results
  },
  getUsersCount: async (_data = []) => {
    const order = _data[3] ? mysql.raw('DESC') : mysql.raw('ASC')
    _data[3] = order
    const data = _data.length < 6 ? ['email', '%', 'email', order, 5, 0] : _data
    const sql = 'SELECT COUNT(users.id) AS total FROM users JOIN user_details ON users.id = user_details.user_id WHERE ? LIKE ? AND users.deleted_at IS NULL ORDER BY ? ?'
    const query = await queryPromise(sql, data)

    return query.results[0].total
  },
  updateUser: async (data) => {
    const sql = 'UPDATE users SET ? WHERE ?'
    const query = await queryPromise(sql, data)

    return query.results.affectedRows
  },
  updateUserDetails: async (data) => {
    const sql = 'UPDATE user_details SET ? WHERE ?'
    const query = await queryPromise(sql, data)

    return query.results.affectedRows
  }
}
