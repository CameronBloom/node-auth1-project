const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const { checkPasswordLength, checkUsernameExists, checkUsernameFree } = require('./auth-middleware')


router.post('/register', checkPasswordLength, checkUsernameFree, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  User.add({ username: username, password: hash })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
})
  
router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body
  if (bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user
    res.json({ status: 200, message: `Welcome ${req.user.username}!` })
  } else {
    next({ status: 401, message: 'Invalid credentials'})
  }
})
 
router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next(err) 
      } else {
        res.json({ message: "logged out" })
      }
    });

  } else {
    res.json({ message: "no session" })
  }
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router