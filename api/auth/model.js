const db = require('../../data/dbConfig')

module.exports = {
    findAll,
    findById,
    add,
}

function findAll() {
    return db('users')
}

function findById(id){
    return db('users')
    .where('id', id)
    .first()
}

function add(user){
    return null
}