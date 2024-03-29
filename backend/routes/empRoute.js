const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const empController = require("../controller/empController");

router.group("/", (router) => {
  router.post("/", auth, empController.addEmp);
  router.get("/", auth, empController.getEmp);
  router.get("/all", auth, empController.getAllEmp);
  router.patch("/", auth, empController.updateEmp);
  router.delete("/:_id", auth, empController.deleteEmp);
});

router.group("/salary", (router) => {
  router.post("/", auth, empController.addSalary);
  router.get("/:empId", auth, empController.getSalary);
  router.patch("/", auth, empController.updateSalary);
  router.delete("/:_id", auth, empController.deleteSalary);
});



module.exports = router;


