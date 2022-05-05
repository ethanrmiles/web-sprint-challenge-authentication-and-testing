function checkPayload (req,res,next){
    // const { username, password } = req.body
    // if(!username || !username.trim()){
    //     next({ message: 'username and password required, invalid username'})
    // }else if(!password || !password.trim()){
    //     next({ message: 'username and password required, invalid password'})
    // }else{
    //     req.body.username = req.body.username.trim()
    //     req.body.password = req.body.password.trim()
    //     next()
    // }]
    if(!req.body.username || !req.body.password){
        next({ status:401, message: 'username and password required'})
    }else{
        req.userInput = {
            username: req.body.username.trim(),
            password: req.body.password.trim(),
        }
        next()
    }
}

module.exports = checkPayload