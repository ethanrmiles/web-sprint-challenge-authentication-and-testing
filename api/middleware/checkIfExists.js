const db = require('../../data/dbConfig')

async function checkUsername (req,res,next) {

    // const validateUser = await model.findUser(username)
    // let { username } = req.body
    // console.log('req.body:', req.body)
    // const query = await model.findUser(username)

    // if(query){
    //     console.log('query:', query)
    //     next({ status: 400, message: 'username taken'})
    // } else {
    //     req.uniqueUsername = username 
    //     console.log('passed username:', username)
    //     next()
    // }
    const existingUser = await db('users').where('username', req.body.username).first()
    if(existingUser){
        next({ status:400, message: 'username is taken'})
    }else{
        next()
    }
}

module.exports = checkUsername