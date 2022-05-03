const model = require('../auth/model')

async function checkUsername (req,res,next) {
    let { username } = req.body
    console.log('req.body:', req.body)
    const query = await model.findUser(username)

    if(query){
        console.log('query:', query)
        next({ status: 400, message: 'username taken'})
    } else {
        req.uniqueUsername = username 
        console.log('passed username:', username)
        next()
    }

}

module.exports = checkUsername