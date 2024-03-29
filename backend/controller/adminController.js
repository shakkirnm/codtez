const bcrypt = require("bcryptjs");
const joi = require("joi");
const createError = require("http-errors");
const Admin = require("../models/Admin");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const createAdmin = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().min(8).required(),
  contact: joi.number().allow(null).allow(""),
});

const loginAdmin = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

module.exports = {

  login: async (req, res, next) => {
    try {
      const bodyValidate = await loginAdmin.validate(req.body);
      if (bodyValidate.error) {
        return res.json({ status: false, message: "invalid data" });
      }

      let admin = await Admin.findOne({ email: req.body.email, status: 0 });
      if (!admin)
        return res.json({ status: false, message: "Invalid email" });

      const validPassword = await bcrypt.compare(
        req.body.password,
        admin.password
      );
      if (!validPassword)
        return res.json({ status: false, message: "Invalid password" });
      const jwtData = {
        adminId: admin._id,
        adminName: admin.name,
      };

      const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });

      const data = {
        _id: admin._id,
        name: admin.name,
        email: admin.email ? admin.email : "",
        contact: admin.contact,
        token
      };
      return res.json({ data, message: global.message.WELCOME });
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
};