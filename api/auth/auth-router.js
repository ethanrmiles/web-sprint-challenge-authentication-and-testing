const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const restricted = require('../middleware/restricted')
const JWT_SECRET = 'shh'
const model = require('./model')
const validatePayload = require('../middleware/checkPayload')
const checkIfExists = require('../middleware/checkIfExists')

router.post('/register', validatePayload, checkIfExists, async(req, res) => {
      try {
        const hash = bcrypt.hashSync(req.userInput.password, 8);
        const obj = {
          username: req.userInput.username,
          password: hash,
        };
        model.add(obj)
          .then((user) => {
            res.json(user);
          })
          .catch((err) => {
            res
              .status(500)
              .json({ message: "internal database error", error: err });
          });
      } catch (err) {
        res.status(500).json({ message: "internal server error" });
      }
});

router.post('/login', async(req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
 let { username, password } = req.body
      if(!username || !password){
        next({status:401, message: 'username and password required'})
      }else {
        model.findUser(username)
       .then(user => {
        if(user){
          if(bcrypt.compareSync(password, user.password)){
            res.status(200).json({
              message: `welcome, ${username}`,
              token: generateToken(user)
            })
          } else {
            next({ status: 401, message: 'invalid credentials'})
          }
        }else{
          next({ message: 'no user returned, invalid'})
        }
       })
       .catch(err => {
         next(err)
       })
      }
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = { expiresIn: '1d'}
  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;