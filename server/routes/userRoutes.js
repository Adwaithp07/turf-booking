const router = require("express").Router();
const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json(user);
});

module.exports = router;