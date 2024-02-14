const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  refUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
