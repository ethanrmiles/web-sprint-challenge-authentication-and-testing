const server = require('./server')
const jokesRouter = require('./jokes/jokes-router')
const authRouter = require('./auth/auth-router')
const request = require('supertest')
const db = require('../data/dbConfig')
const jokesData = require('./jokes/jokes-data')
const model = require('./auth/model')

const fakeUser = {
  username: 'fakeUser',
  password: 'foobarbaz'
}


test('sanity', () => {
  expect(true).toBe(true)
})

describe('tests relating to the jokes endpoint', () => {
  test('check that the server is up and running', async() => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'the server is up and running!'})
  })
})

describe('tests relating to --POST-- /api/auth/register', () => {
  test('can create a new user when all requirements fufilled', async () => {
     await request(server).post('/api/auth/register').send(fakeUser)
    const fakeUser = await db('users').where('username', 'fakeUser').first()
    expect(fakeUser).toMatchObject({ username: 'fakeUser'})
  })
  test('when username or password is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: null, password: 'foobarbaz'})
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'username and password required'})
    res = await request(server).post('/api/auth/register').send({ username: 'fakeUser', password: null })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'username and password required'})
  })
})

describe('tests relating to --POST-- /api/auth/login', () => {
  test('can successfully login', async () => {
    const res = await request(server).post('/api/auth/login').send(fakeUser)
    expect(res.body.message).toEqual('welcome, fakeUser')
    expect(res.body).toHaveProperty('token')
  })
  test('message on failed login due to invalid password or invalid username', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'fakeUser', password: 'theWRONGpassword98' })
    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'invalid credentials'})
  })
  test('message on failed login due to invalid password or invalid username', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'fakeUser', password: 'theWRONGpassword98' })
    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'invalid credentials'})
  })
  test('message on failed login because username or password null', async() => {
    const res = await request(server).post('/api/auth/login').send({ username: null , password: 'foobarbaz' })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'username and password required' })
  })
})