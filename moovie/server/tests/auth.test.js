import request from 'supertest';
import app from '../src/index.js';
import { registerUser, loginUser } from './testUtils.js';

/* ======================================================
   AUTH – POSITIVE TESTS
====================================================== */

describe('Auth – positive cases', () => {
  test('Register user successfully', async () => {
    const res = await registerUser();

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
  });

  test('Login user successfully', async () => {
    await registerUser();

    const res = await loginUser('test@example.com', 'StrongPass1');

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Access protected route with valid token', async () => {
    await registerUser();
    const login = await loginUser('test@example.com', 'StrongPass1');

    const res = await request(app)
      .get('/auth/protected')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('testuser');
  });

  test('Delete user account with correct password', async () => {
    await registerUser();
    const login = await loginUser('test@example.com', 'StrongPass1');

    const res = await request(app)
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ password: 'StrongPass1' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Account deleted successfully');
  });
});

/* ======================================================
   AUTH – NEGATIVE TESTS
====================================================== */

describe('Auth – negative cases', () => {
  test('Fail registration with weak password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'weakuser',
        email: 'weak@example.com',
        password: '123',
      });

    expect(res.statusCode).toBe(403);
  });

  test('Fail registration with duplicate email', async () => {
    await registerUser();

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'StrongPass1',
      });

    expect(res.statusCode).toBe(400);
  });

  test('Fail login with incorrect password', async () => {
    await registerUser();

    const res = await loginUser('test@example.com', 'WrongPass1');

    expect(res.statusCode).toBe(400);
  });

  test('Fail accessing protected route without token', async () => {
    const res = await request(app).get('/auth/protected');

    expect(res.statusCode).toBe(401);
  });

  test('Fail deleting account with wrong password', async () => {
    await registerUser();
    const login = await loginUser('test@example.com', 'StrongPass1');

    const res = await request(app)
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ password: 'WrongPass1' });

    expect(res.statusCode).toBe(401);
  });
});
