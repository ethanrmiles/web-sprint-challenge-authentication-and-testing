const jwt = require('jsonwebtoken')
const JWT_SECRET = 'shh'


module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  const token = req.headers.authorization
  const missingTokenMessage = 'token required'
  const invalidTokenMessage = 'token invalid'
  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if(err){
      console.log(err)
      next({ status:401, message: missingTokenMessage })
      return
    }
    console.log(decodedToken)
  })
};
