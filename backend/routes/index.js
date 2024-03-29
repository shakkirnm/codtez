const express = require("express");
const router = express.Router();

const empRoute = require("./empRoute");
const adminRoute = require("./adminRoute");

router.use("/employee", empRoute);
router.use("/admin", adminRoute);

module.exports = router;
