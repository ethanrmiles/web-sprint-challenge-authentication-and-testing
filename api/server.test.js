const server = require('./server')
const jokesRouter = require('./jokes/jokes-router')
const authRouter = require('./auth/auth-router')
const request = require('supertest')
const db = require('../data/dbConfig')
const jokesData = require('./jokes/jokes-data')
const model = require('./auth/model')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach( async () => {
  await db('users').truncate()
  await db('users').insert([
    { username: 'fakeUser', password: '$2a$08$QlDr5TaW49BxnLc0Ip6yMuZDpg7j36p2w2CWvpDYRiz.2y6lP82XS', }, //password is 1234
    { username: 'ethan', password: '$2a$08$QlDr5TaW49BxnLc0Ip6yMuZDpg7j36p2w2CWvpDYRiz.2y6lP82XS', },
  ])
})

// afterAll(async () => {
//   await db.destroy()
// })

test('sanity', () => {
  expect(true).toBe(true)
})

describe('tests checking model functions', () => {
  test('can get all', async () => {
    const res = await model.findAll()
    expect(res.length).toBe(2)
    expect(res[1].username).toBe('ethan')
  })
  test('can get by id', async() => {
    let res = await model.findById(0)
    expect(res).not.toBeDefined()
    res = await model.findById(1)
    expect(res.username).toBe('fakeUser')
  })
  test('can add', async () => {
    let res = await model.add({ username: 'bloom', password: 'tech' })
    expect(res).toHaveProperty('username', 'bloom')
    expect(res.id).toBe(3)
    res = await model.findAll()
    expect(res.length).toBe(3)
  })
  test('can find by user', async() => {
    let res = await model.findUser('ethan')
    expect(res.username).toBe('ethan')
  })
})


describe('sanity 2', () => {
  test('check that the server is up and running', async() => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'the server is up and running!'})
  })
})

describe('tests relating to --POST-- /api/auth/register', () => {
  test('can create a new user when all requirements fufilled', async () => {
     await request(server).post('/api/auth/register').send({username: 'fakeUser', password: '1234'})
    const fakeUser = await db('users').where('username', 'fakeUser').first()
    expect(fakeUser).toMatchObject({ username: 'fakeUser'})
  })
  test('when username or password is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({ username: null, password: '1234'})
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username and password required')
  })
})

describe('tests relating to --POST-- /api/auth/login', () => {
  test('can successfully login', async () => {
    const res = await request(server).post('/api/auth/login').send({username: 'fakeUser', password: '1234'})
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
    const res = await request(server).post('/api/auth/login').send({ username: null , password: '1234' })
    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'username and password required' })
  })
})

describe('tests relating to /jokes', () => {
  test('requests without a token are not allowed', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toBe('token invalid')
  })
  test('requests with a valid token display jokes', async() => {
    let res = await request(server).post('/api/auth/login').send({username: 'fakeUser', password: '1234'})
    res = await request(server).get('/api/jokes').set('authorization', res.body.token)
    expect(res.body.length).toBe(3)
  })
})