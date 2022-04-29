const jwt = require('jsonwebtoken')
const JWT_SECRET = 'shh'
const model = require('../auth/model')


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
      next({ status:401, message: invalidTokenMessage })
      return
    }
    const user = await model.findById(decodedToken.subject)
    if(decodedToken.iat < user.logged_out_time) {
      next({ status: 401, message: MESSAGE_401 });
      return;
    }

    req.decodedJwt = decodedToken;
    console.log('decoded token:', req.decodedJwt);
    next();
  })
};
