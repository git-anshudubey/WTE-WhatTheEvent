// Run this script to create an admin user
// Usage: node create-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@eventhub.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@eventhub.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@eventhub.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@eventhub.com');
        console.log('Password: admin123');
        console.log('\nYou can now login as admin and access:');
        console.log('- /manage-events (View all events)');
        console.log('- /create-event (Create new event)');
        console.log('- /admin/dashboard (Analytics)');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
