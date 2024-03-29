const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const adminController = require("../controller/adminController");

router.group("/", (router) => {
  // router.post("/signup", adminController.signUp);
  router.post("/login", adminController.login);
});

module.exports = router;


