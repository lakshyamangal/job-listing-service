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

    const userResponse = userData.save();
    // you could write userResponse directly as well there is no problem in that. //
    const token = await jwt.sign(
      { userID: userResponse._id },
      process.env.JWT_SECRET
    );
    res.json({
      message: "User regitered Successfully",
      token: token,
      name: name,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
