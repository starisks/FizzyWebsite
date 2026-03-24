const connectDB = require("../../lib/db");
const Post = require("../../models/Post");

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  }

  if (req.method === "POST") {
    const post = await Post.create(req.body);
    res.json(post);
  }
};