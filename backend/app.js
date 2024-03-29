require("dotenv").config();
require("express-group-function");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const mongoose= require('mongoose')
const cors=require('cors')

global.message = require("./config/message");
const responseHandler = require("./middlewares/responseHandler");
const routes = require("./routes/index");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connection successful");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectToMongoDB();

app.use(responseHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send(global.message.WELCOME).end();
});

app.listen(port, () => {
  console.log("backend server is running ");
});
