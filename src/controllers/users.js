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
  res.status(_status).send(data)
}

module.exports = {
  getAllUsers: (req, res) => {
    standardResponse({ message: 'Hello from /users' }, res)
  }
}
