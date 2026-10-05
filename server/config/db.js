const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ambunear';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    console.warn(
      '[MongoDB] Hint: If running locally without a MongoDB daemon, consider using MongoDB Atlas and setting MONGODB_URI in your server .env file.'
    );
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('[MongoDB] Connection closed.');
  }
};

module.exports = { connectDB, disconnectDB };
