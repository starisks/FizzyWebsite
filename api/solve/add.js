const connectDB = require("../../lib/db");
const Solve = require("../../models/Solve");
const auth = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();

  const user = auth(req);
  if (!user) return res.status(401).end();

  const { time } = req.body;

  await Solve.create({
    userId: user.id,
    time
  });

  res.json({ ok: true });
};