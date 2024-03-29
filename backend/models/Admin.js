const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    min: 4,
  },
  contact: {
    type: Number,
    minLength: 10,
    maxLength: 10,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
