const jokesRouter = require('./jokes/jokes-router')
const authRouter = require('./auth/auth-router')
const request = require('supertest')
const db = require('../data/dbConfig')
const jokesData = require('./jokes/jokes-data')


test('sanity', () => {
  expect(true).toBe(true)
})

describe('tests relating to the jokes endpoint', () => {
  test()
})
