import request from 'supertest';
import app from '../src/index.js';
import { registerUser, loginUser } from './testUtils.js';

/* ======================================================
   REVIEWS – POSITIVE TESTS
====================================================== */

describe('Reviews – positive cases', () => {
    test('Fetch reviews for a movie when none exist', async () => {
        const res = await request(app).get('/api/reviews/123');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews).toEqual([]);
        expect(res.body.avgRating).toBe(0);
    });

    test('Add a review and fetch it successfully', async () => {
        await registerUser();
        const login = await loginUser('test@example.com', 'StrongPass1');

        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send({
                movie_id: 123,
                movie_name: 'Inception',
                content: 'Great movie',
                rating: 5,
            });

        const res = await request(app).get('/api/reviews/123');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews.length).toBe(1);
        expect(res.body.avgRating).toBe(5);
    });
});

/* ======================================================
   REVIEWS – NEGATIVE TESTS
====================================================== */

describe('Reviews – negative cases', () => {
    test('Fail adding review without authentication', async () => {
        const res = await request(app)
            .post('/api/reviews')
            .send({
                movie_id: 123,
                content: 'No auth review',
                rating: 4,
            });

        expect(res.statusCode).toBe(401);
    });

    test('Fail adding review without content', async () => {
        await registerUser();
        const login = await loginUser('test@example.com', 'StrongPass1');

        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send({
                movie_id: 123,
                content: '',
                rating: 4,
            });

        expect(res.statusCode).toBe(400);
    });

    test('Fail adding duplicate review for same movie', async () => {
        await registerUser();
        const login = await loginUser('test@example.com', 'StrongPass1');

        const review = {
            movie_id: 123,
            movie_name: 'Inception',
            content: 'First review',
            rating: 4,
        };

        await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send(review);

        const res = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send(review);

        expect(res.statusCode).toBe(400);
    });

});
