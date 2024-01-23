const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/create", verifyJwt, async (req, res) => {
  try {
    const { companyName, logoUrl, title, description } = req.body;
    if (!companyName || !logoUrl || !title || !description)
      return res.status(400).json({ message: "Bad Request" });

    jobDetails = new Job({
      companyName,
      logoUrl,
      title,
      description,
      refUserId: req.body.userId,
    });
    await jobDetails.save();
    res.json({ message: "New job created successfully" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
