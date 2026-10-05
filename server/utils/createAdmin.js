/**
 * AmbuNear - Secure Admin Account Bootstrap Utility
 * Usage: node server/utils/createAdmin.js [name] [email] [phone] [password]
 * Or prompt/default environment-based creation.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const bootstrapAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ambunear';

  try {
    await mongoose.connect(mongoUri);
    console.log('[Bootstrap] Connected to MongoDB.');

    const name = process.argv[2] || process.env.ADMIN_NAME || 'AmbuNear Super Admin';
    const email = (process.argv[3] || process.env.ADMIN_EMAIL || 'admin@ambunear.com').toLowerCase();
    const phone = process.argv[4] || process.env.ADMIN_PHONE || '+91 99999-00000';
    const password = process.argv[5] || process.env.ADMIN_PASSWORD || 'Admin@AmbuNear2026!';

    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`[Bootstrap] Admin user with email ${email} already exists.`);
      console.log(`[Bootstrap] Updating role to ADMIN and status to ACTIVE.`);
      admin.role = 'ADMIN';
      admin.accountStatus = 'ACTIVE';
      admin.passwordHash = await User.hashPassword(password);
      await admin.save();
      console.log(`[Bootstrap] Admin credentials refreshed successfully.`);
    } else {
      const passwordHash = await User.hashPassword(password);
      admin = await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: 'ADMIN',
        accountStatus: 'ACTIVE',
      });
      console.log(`[Bootstrap] New Admin created successfully!`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role:  ${admin.role}`);
    }

    await mongoose.connection.close();
    console.log('[Bootstrap] Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error(`[Bootstrap Error] ${err.message}`);
    process.exit(1);
  }
};

bootstrapAdmin();
