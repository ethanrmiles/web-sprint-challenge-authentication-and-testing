const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const restricted = require('../middleware/restricted')
const JWT_SECRET = 'shh'
const model = require('./model')
const checkUsername = require('../middleware/checkIfExists')
const checkPayload  = require('../middleware/checkPayload')


router.post('/register',checkPayload, async(req, res, next) => {
 
      let { username, password } = req.body
      const hash = bcrypt.hashSync(password, 8)
      // const validateUser = await model.findUser(username)
      model.add({username, password: hash})
       .then(newUser => {
         console.log('newUser', newUser.id)
         const user = {
           id: newUser.id,
           username: newUser.username,
           password: newUser.password
         }
         //{ message: `welcome, ${username}`,user }
         res.status(201).json(user)
       })
       .catch(err => {
         next({status: 501, message: 'internal server ERROR'})
       })
     
});

router.post('/login', checkPayload, async(req, res, next) => {
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
        const existingUser = await model.findUser(username)
        if(existingUser && bcrypt.compareSync(password, existingUser.password)){
          res.status(200).json({
            message: `welcome, ${username}`,
            token: generateToken(existingUser)
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

router.post('/test', checkUsername, (req,res,next) => {
    res.json(req.uniqueUsername)
})

module.exports = router;
