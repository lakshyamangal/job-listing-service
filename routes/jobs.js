const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const verifyJwt = require("../middlewares/authMiddleware");

router.post("/create", verifyJwt, async (req, res) => {
  try {
    const {
      companyName,
      logoUrl,
      title,
      salary,
      type,
      place,
      location,
      description,
      about,
      skills,
      info,
    } = req.body;
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !salary ||
      !type ||
      !place ||
      !location ||
      !about ||
      !info ||
      !description ||
      !skills
    )
      return res.status(400).json({ message: "Bad Request" });

    jobDetails = new Job({
      companyName,
      logoUrl,
      title,
      salary,
      type,
      place,
      location,
      description,
      about,
      skills,
      info,
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
    const {
      companyName,
      logoUrl,
      title,
      salary,
      type,
      place,
      location,
      description,
      about,
      skills,
      info,
    } = req.body;
    if (
      !companyName ||
      !logoUrl ||
      !title ||
      !salary ||
      !type ||
      !place ||
      !location ||
      !about ||
      !info ||
      !description ||
      !skills
    )
      return res.status(400).json({ message: "Bad Request" });
    const jobId = req.params.jobId;

    const jobUpdate = await Job.updateOne(
      { _id: jobId },
      {
        $set: {
          companyName,
          logoUrl,
          title,
          salary,
          type,
          place,
          location,
          description,
          about,
          skills,
          info,
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
    // ** Doubt -->This is when we write "" pehele || is se pehele then it's wrong why?? jab pehele maine new Url waali cheez nahi kari thi//
    // ** Notes/Doubt --> it checks when "" is first then it checks on the other side of the or operator then wahan par bhi false aayega agar title query hi nahi hain to , then it will consider empty string over undefined but what is the case when title is thee but empty string tab to hona chaiye ??
    const title = req?.query?.title || "";
    const skills = req?.query?.skills;
    const filterSkills = skills?.split(",");
    // console.log("line no 129 /all", filterSkills, title);
    let filter = {};
    if (filterSkills) filter = { skills: { $in: [...filterSkills] } };
    const jobList = await Job.find({
      title: { $regex: title, $options: "i" },
      ...filter,
    });
    console.log(jobList);
    res.json({ jobList });
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
