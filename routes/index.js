var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderSchool!");
});

const userApi = require("./user.api");
router.use("/user", userApi);

const taskApi = require("./task.api");
router.use("/task", taskApi);

module.exports = router;
