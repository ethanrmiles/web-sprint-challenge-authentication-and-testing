const db = require('../../data/dbConfig')

module.exports = {
    findAll,
    findById,
    add,
    findUser
}

function findAll() {
    return db('users')
}

function findById(id){
    return db('users')
    .where('id', id)
    .first()
}

async function findUser(username){
    const [user] = await db('users').where('username', username)
    return user
}

async function add(user){
    // return db('users')
    // .insert(user)
    // .then(([id]) => findById(id))
    const [id] = await db('users').insert(user)
    return findById(id)
}