const express = require("express");
const router = express.Router();
const {
  createUser,
  findUser,
  getAllUser,
} = require("../controllers/user.controllers");

router.get("/", getAllUser);

router.post("/", createUser);

router.get("/:id", findUser);

module.exports = router;
