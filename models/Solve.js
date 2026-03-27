const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  time: Number,
  createdAt: { type: Date, default: Date.now }
});

schema.index({ time: 1 });

module.exports = mongoose.models.Solve || mongoose.model("Solve", schema);