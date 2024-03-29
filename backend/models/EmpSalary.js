const mongoose = require("mongoose");

const empSalarySchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  salaryPerDay: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("EmpSalary", empSalarySchema);
