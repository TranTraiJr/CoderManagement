const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTask,
  editTask,
  deleteTask,
  responsibleBy,
  removeResponsilble,
} = require("../controllers/task.controllers");

router.get("/", getAllTask);

router.post("/", createTask);

router.put("/:id", editTask);

router.delete("/:id", deleteTask);

router.post("/:id", responsibleBy);

router.delete("/:id/:userName", removeResponsilble);

module.exports = router;

// {
//   "name":"lovingg",
//   "description":"just lovingg so",
//   "status":"pending"
// }
