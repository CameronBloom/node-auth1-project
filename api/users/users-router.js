// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require('express')
const router = express.Router()
const { restricted } = require('../auth/auth-middleware')
const User = require('./users-model')

router.get('/', restricted, async (req, res, next) => {
  try {
    const users = await User.find()
    console.log(users)
    res.json(users)
  } catch(err) {
    next(err)
  }
})

module.exports = router