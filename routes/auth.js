const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password)
      return res.json({ message: "Bad request" });

    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser)
      return res.status(409).json({ message: "User already exists" });

    const isExistingMobile = await User.findOne({ mobile: mobile });
    if (isExistingMobile)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    const userResponse = await userData.save();
    const id = userResponse._id;
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET);
    res.json({
      message: "User regitered Successfully",
      token: token,
      name: name,
    });
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Bad request" });

    const userDetails = await User.findOne({ email });
    if (!userDetails)
      return res.status(401).json({ message: "Invalid Credentials" });

    const passwordMatch = await bcrypt.compare(password, userDetails.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    const token = await jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );
    res.json({
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
    });
  } catch (err) {}
});

module.exports = router;
