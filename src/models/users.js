const db = require('../utils/db')

const queryPromise = (sql, data) => {
  return new Promise((resolve, reject) => {
    db.query(sql, data, (err, results, fields) => {
      if (err) {
        reject(Error(err))
      }
      resolve({ results, fields })
    })
  })
}

module.exports = {
  getAllUsers: async () => {
    const sql = 'SELECT * FROM users'
    const query = await queryPromise(sql)

    return query.results
  },
  createUser: async (data) => {
    const sql = 'INSERT INTO users SET ?'
    const query = await queryPromise(sql, data)

    return query.results.insertId
  },
  getUsersByCondition: async (data) => {
    const sql = 'SELECT * FROM users WHERE ?'
    const query = await queryPromise(sql, data)

    return query.results
  }
}
