const joi = require("joi");
const createError = require("http-errors");
const Employee = require("../models/Employee");
const EmpSalary = require("../models/EmpSalary");
const nodemailer = require("nodemailer");
const generatePassword = require("generate-password");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { empIdGenerator } = require("../utils/common")


const addEmp = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
  email: joi.string(),
  mobile: joi.number().required(),
  emergencyContact: joi.number().required(),
  jobPosition: joi.string().required(),
  department: joi.string().required(),
  joiningDate: joi.date().required(),
});

const getEmp = joi.object({
  _id: joi.string().required(),
});

const updateEmp = joi.object({
  _id: joi.string().required(),
  name: joi.string(),
  address: joi.string(),
  email: joi.string(),
  mobile: joi.number(),
  emergencyContact: joi.number(),
  empIdNumber: joi.string(),
  jobPosition: joi.string(),
  department: joi.string(),
  joiningDate: joi.date(),
});

const deleteEmp = joi.object({
  _id: joi.string().required(),
});

const addSalary = joi.object({
  empId: joi.string().required(),
  salaryPerDay: joi.number().required(),
  month: joi.string().required(),
  workingDays: joi.number().required(),
  year: joi.number().required(),
});

const getSalary = joi.object({
  empId: joi.string().required(),
});

const updateSalary = joi.object({
  _id: joi.string().required(),
  empId: joi.string().required(),
  salaryPerDay: joi.number().required(),
  month: joi.string().required(),
  workingDays: joi.number().required(),
  year: joi.number().required(),
  totalSalary: joi.number().required(),
});

const deleteSalary = joi.object({
  _id: joi.string().required(),
});

module.exports = {
  addEmp: async (req, res, next) => {
    try {
      const bodyValidate = await addEmp.validate(req.body);
      if (bodyValidate.error) {
        res.json({ message: "Invalid data", status: false })
      }
      else {

        const mobileOrEmail = await Employee.findOne({
          $or: [
            {
              mobile: req.body.mobile,
              status: 0,
            },
            {
              email: req.body.email,
              status: 0,
            },
            // Add more conditions as needed
          ]
        });

        if (mobileOrEmail) {

          res.json({ status: false, message: global.message.MOBILE_EMAIL_ALREADY_EXIST });
        }
        else {

          const empIdNumber = await empIdGenerator();
          // Sending welcome email
          await sendWelcomeEmail(req.body);

          // Generating a random password
          const newPassword = generateRandomPassword();

          // Sending email with the auto-generated password
          await sendPasswordEmail(req.body.email, newPassword);

          // Hashing the password
          const hashedPassword = bcrypt.hashSync(newPassword, salt);
          req.body.password = hashedPassword;
          req.body.empIdNumber = empIdNumber;
          // Saving employee details
          const newEmp = new Employee(req.body);
          const employee = await newEmp.save();

          res.responseHandler(employee, global.message.EMPLOYEE_CREATED);
        }
      }
    } catch (err) {
      res.json({ status: false, message: err.message });
    }

    // Function to send welcome email
    async function sendWelcomeEmail(data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: data.email,
        subject: "Welcome codeTez family!",
        text: `Dear ${data.name},
                Welcome aboard! We're thrilled to have you join us at CodeTez. Your talents and enthusiasm are valuable additions to our team. We look forward to working together and achieving great things.
    
                Best regards,
    
                Team CODETEZ`,
      };

      await transporter.sendMail(mailOptions);
    }

    // Function to generate a random password
    function generateRandomPassword() {
      return generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        excludeSimilarCharacters: true,
      });
    }

    // Function to send email with auto-generated password
    async function sendPasswordEmail(email, password) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: email,
        subject: "Login credentials",
        text: `Your new gmail is: ${email}
                Your new password is: ${password}`,
      };

      await transporter.sendMail(mailOptions);
    }
  },
  getEmp: async (req, res, next) => {
    try {
      const bodyValidate = await getEmp.validate(req.body);
      if (bodyValidate.error) {
        res.json({ message: "Invalid data", status: false })
      }
      const filter = {
        _id: req.body._id,
        status: 0,
      };
      const employee = await Employee.find(filter);

      res.responseHandler(employee, global.message.DATA_FETCHED_SUCCESSFULLY);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  getAllEmp: async (req, res, next) => {
    try {
      const filter = {
        status: 0,
      };
      const employee = await Employee.find(filter);

      res.responseHandler(employee, global.message.DATA_FETCHED_SUCCESSFULLY);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  updateEmp: async (req, res, next) => {
    try {
      const bodyValidate = await updateEmp.validate(req.body);
      if (bodyValidate.error) {
        res.json({ message: "Invalid data", status: false })
      }
      else {

        let filter = {
          _id: req.body._id,
          status: 0,
        };

        const employee = await Employee.findOneAndUpdate(filter, req.body, {
          new: true,
        });

        res.responseHandler(employee, global.message.DATA_UPDATED_SUCCESSFULLY);
      }

    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  deleteEmp: async (req, res, next) => {
    try {
      const bodyValidate = await deleteEmp.validate(req.params);
      if (bodyValidate.error) {
        return res.json({ message: "Invalid data", status: false })
      }


      let filter = {
        _id: req.params._id,
        status: 0,
      };

      await Employee.findOneAndUpdate(filter, { status: 1 });

      res.responseHandler([], global.message.EMPLOYEE_DELETED, 200);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  addSalary: async (req, res, next) => {
    try {
      const bodyValidate = await addSalary.validate(req.body);
      if (bodyValidate.error) {
        return res.json({ message: "Invalid data", status: false })
      }


      let emp = await Employee.findOne({ _id: req.body.empId });
      if (!emp) throw new Error(global.message.EMPLOYEE_NOT_FOUND);

      // let salary = await EmpSalary.findOne({ empId: req.body.empId });
      // if (salary) throw new Error(global.message.SALARY_ALREADY_ADDED);

      const totalSalary = (await req.body.salaryPerDay) * req.body.workingDays;

      req.body.totalSalary = totalSalary;

      const newEmpSalary = new EmpSalary(req.body);
      const empSalary = await newEmpSalary.save();

      res.responseHandler(empSalary, global.message.SALARY_ADDED);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  getSalary: async (req, res, next) => {
    try {
      const bodyValidate = await getSalary.validate(req.params);
      if (bodyValidate.error) {
        return res.json({ message: "Invalid data", status: false })
      }


      const filter = {
        empId: req.params.empId,
      };
      const empSalary = await EmpSalary.find(filter);
      res.responseHandler(empSalary, global.message.DATA_FETCHED_SUCCESSFULLY);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  updateSalary: async (req, res, next) => {
    try {
      const bodyValidate = await updateSalary.validate(req.body);
      if (bodyValidate.error) {
        return res.json({ message: "Invalid data", status: false })
      }


      let filter = {
        _id: req.body._id,
      };

      const empSalary = await EmpSalary.findOneAndUpdate(filter, req.body, {
        new: true,
      });

      res.responseHandler(empSalary, global.message.DATA_FETCHED_SUCCESSFULLY);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
  deleteSalary: async (req, res, next) => {
    try {
      const bodyValidate = await deleteSalary.validate(req.params);
      if (bodyValidate.error) {
        return res.json({ message: "Invalid data", status: false })
      }


      let filter = {
        _id: req.params._id,
      };

      await EmpSalary.findOneAndDelete(filter);

      res.responseHandler([], global.message.EMPLOYEE_SALARY_DELETED, 200);
    } catch (err) {
      res.json({ status: false, message: err.message });
    }
  },
};
