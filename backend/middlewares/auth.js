const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.json({ status: 401, message: "unauthorized" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.json({ status: 401, message: "unauthorized" });

  }
};