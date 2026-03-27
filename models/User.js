const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  password: { type: String, select: false },
  bestTime: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
});

schema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.models.User || mongoose.model("User", schema);