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

router.put("/edit/:jobId", verifyJwt, async (req, res) => {
  try {
    const { companyName, logoUrl, title, description } = req.body;
    const jobId = req.params.jobId;
    if (!companyName || !logoUrl || !title || !description)
      return res.status(400).json({ message: "Bad Request" });

    const jobUpdate = await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          logoUrl,
          title,
          description,
        },
      }
    );
    if (!jobUpdate.matchedCount) res.json({ message: "no Matched entry" });
    else res.json({ message: "Job details updataed successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/job-description/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const jobDetails = await Job.findById(jobId);
    res.json({ data: jobDetails });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all", async (req, res) => {
  try {
    // the presence of the double quotes here allows every entry to display if one has not given a title //
    const title = req.query.title || "";
    const skills = req.query.skills;
    const filterSkills = skills?.split(",");
    let filter = {};
    if (filterSkills) filter = { skills: { $in: [...filterSkills] } };
    const jobList = await Job.find({
      title: { $regex: title, $options: "i" },
      ...filter,
    });
    res.json({ data: jobList });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:jobId", verifyJwt, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    await Job.findByIdAndDelete(jobId);
    res.status(200).json({ message: "Job Deleted" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
