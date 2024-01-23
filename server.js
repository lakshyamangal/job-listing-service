const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

require("dotenv").config();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/auth", authRoutes);
app.get("/health", (req, res) => {
  res.json({
    service: "job listing service",
    status: "Active",
    time: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
