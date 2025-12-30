const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming server.js exports app
const User = require('../models/User');

beforeAll(async () => {
    // Determine DB_URI based on environment/config
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/event-booking-test';
    // Mongoose handles connection reuse, but strict check helps
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(dbUri);
    }
});

afterAll(async () => {
    await User.deleteMany({ email: 'test@example.com' }); // Cleanup
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should block invalid login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
    });
});
