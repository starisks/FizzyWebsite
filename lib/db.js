const mongoose = require("mongoose");

let isConnected = false;

module.exports = async function connectDB() {
  if (isConnected) return;

  console.log("Connecting to DB...");
  console.log("URI:", process.env.MONGODB_URI); // debug

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "cubing"
  });

  isConnected = true;
};