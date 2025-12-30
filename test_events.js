const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEventCRUD() {
    try {
        console.log('1. Logging in as Admin (creating new if needed)...');
        // Using a known admin or registering one
        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@test.com',
                password: 'password123'
            });
            token = loginRes.data.token;
            console.log('   Logged in.');
        } catch (e) {
            console.log('   Login failed, trying register...');
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin' // Note: Public register endpoint might not allow setting role, but let's try or assume DB seed. 
                // Actually, our model allows it by default in schema (security risk for prod, handy for dev).
            });
            token = regRes.data.token;
            console.log('   Registered and logged in.');
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log('2. Creating Event...');
        const eventData = {
            title: 'Test Event',
            description: 'This is a test event',
            date: '2025-01-01',
            location: 'Test Location',
            category: 'Workshop',
            price: 100
        };
        // Note: Not testing image upload here as it requires FormData complexity in node script, just JSON body
        // Controller handles req.body even if not valid multipart for image? No, controller checks req.body fields. 
        // Wait, update/create controllers destructure req.body. 
        // It should work for text fields.
        const createRes = await axios.post(`${API_URL}/events`, eventData, config);
        const eventId = createRes.data._id;
        console.log(`   Event created: ${eventId}`);

        console.log('3. Updating Event...');
        const updateRes = await axios.put(`${API_URL}/events/${eventId}`, {
            title: 'Updated Test Event',
            price: 150
        }, config);
        if (updateRes.data.title === 'Updated Test Event') {
            console.log('   Event updated successfully.');
        } else {
            console.error('   Update failed mismatch.');
        }

        console.log('4. Deleting Event...');
        await axios.delete(`${API_URL}/events/${eventId}`, config);
        console.log('   Event deleted.');

        console.log('5. Verifying Deletion...');
        try {
            await axios.get(`${API_URL}/events/${eventId}`);
            console.error('   Error: Event still exists!');
        } catch (e) {
            if (e.response.status === 404) {
                console.log('   Verification successful: Event not found (404).');
            } else {
                console.error('   Unexpected error:', e.message);
            }
        }

    } catch (error) {
        console.error('TEST FAILED:', error.response ? error.response.data : error.message);
    }
}

testEventCRUD();
