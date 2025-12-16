import request from 'supertest';
import app from '../src/index.js';

export async function registerUser(overrides = {}) {
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPass1',
    ...overrides,
  };

  const res = await request(app)
    .post('/auth/register')
    .send(user);

  return res;
}

export async function loginUser(email, password) {
  return request(app)
    .post('/auth/login')
    .send({ email, password });
}
