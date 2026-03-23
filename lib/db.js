const mongoose = require('mongoose');

let isConnected = false;

module.exports = async function  connectDB() {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
};