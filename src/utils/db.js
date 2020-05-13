require('dotenv').config()
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env
const mysql = require('mysql')

const options = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
}
const conn = mysql.createConnection(options)

module.exports = conn
