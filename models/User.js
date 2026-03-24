const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);