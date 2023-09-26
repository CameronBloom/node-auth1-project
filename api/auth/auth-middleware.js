const User = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  next()
}

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) {
      next()
    } else {
      next({ status: 422, message: "Username taken"})
    }
  } catch (err) {
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (users.length) {
      next()
    } else {
      next({ status: 401, message: "Invalid credentials"})
    }
  } catch (err) {
    next(err)
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 3) {
    next({ status: 422, message: "Password must be longer than 3 chars"})
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}