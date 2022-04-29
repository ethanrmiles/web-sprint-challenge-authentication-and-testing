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
    return null
}

function add(user){
    return null
}