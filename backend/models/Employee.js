const mongoose = require("mongoose");

const empScheema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
    min: 4,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    minLength: 10,
    maxLength: 10,
  },
  emergencyContact: {
    type: Number,
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  empIdNumber: {
    type: String,
    required: true,
    unique: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

module.exports = mongoose.model("Employee", empScheema);
