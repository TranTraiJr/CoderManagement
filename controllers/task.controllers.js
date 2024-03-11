const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};

taskController.createTask = async (req, res, next) => {
  const { name, description, status, responsibleBy, isDeleted } = req.body;

  try {
    //always remember to control your inputs
    if (!name || !description || !status) {
      const exception = new Error(`Missing task's information`);
      exception.statusCode = 400;
      throw exception;
    }
    const validate = await Task.find({ name: name });
    const isValidate = Object.keys(validate);
    if (isValidate.length) {
      const exception = new Error(`Task's name already exist`);
      exception.statusCode = 400;
      throw exception;
    }

    const result = await Task.create({
      name,
      description,
      status,
      responsibleBy,
      isDeleted,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

taskController.getAllTask = async (req, res, next) => {
  const filter = { isDeleted: false };
  try {
    const listOfFound = await Task.find(filter).populate("responsibleBy");
    const data = {
      tasks: listOfFound,
      message: "Get Tasks List Successfully!",
    };

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

taskController.editTask = async (req, res, next) => {
  try {
    const allowUpdate = ["name", "description", "status"];
    const id = req.params["id"];
    console.log("hihi", id);
    const updates = req.body;
    const updateKeys = Object.keys(updates);

    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));
    if (notAllow.length) {
      const exception = new Error(`Update field not allow`);
      exception.statusCode = 401;
      throw exception;
    }

    const findStatus = await Task.findById(id);
    if (findStatus.status === "done" && updates.status !== "archive") {
      const exception = new Error(`This task has been done`);
      exception.statusCode = 401;
      throw exception;
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    console.log("huhu", updated);

    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
};

taskController.deleteTask = async (req, res, next) => {
  try {
    const id = req.params["id"];

    // console.log(id);
    if (!id) {
      const exception = new Error(`Invalid ID`);
      exception.statusCode = 401;
      throw exception;
    }

    const deletedTask = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json("Task deleted");
  } catch (err) {
    next(err);
  }
};

taskController.responsibleBy = async (req, res, next) => {
  // router.put("/:id/:userName", responsibleBy);

  // task/:taskId rep.body la id cua User
  try {
    const id = req.params["id"];
    const { userId } = req.body;
    console.log("hihi", id, userId);

    // console.log(id);
    if (!userId) {
      const exception = new Error(`Invalid User to handle Task`);
      exception.statusCode = 400;
      throw exception;
    }

    if (!id) {
      const exception = new Error(`Add task handle`);
      exception.statusCode = 400;
      throw exception;
    }

    let foundTask = await Task.findById(id);
    let checkHandle = foundTask.responsibleBy;
    console.log("check", checkHandle);
    if (checkHandle) {
      const exception = new Error(`Task Already taken by someone else`);
      exception.statusCode = 400;
      throw exception;
    }
    if (!foundTask) {
      const exception = new Error(`Task Not Found`);
      exception.statusCode = 400;
      throw exception;
    }
    let foundUser = await User.findById(userId);
    if (!foundUser) {
      const exception = new Error(`User Not Found`);
      exception.statusCode = 400;
      throw exception;
    }

    foundTask.responsibleBy = userId;
    foundTask = await foundTask.save();
    foundUser.responsibleTask = id;
    foundUser = await foundUser.save();

    res.status(200).json(foundTask);
  } catch (err) {
    next(err);
  }
};

taskController.removeResponsilble = async (req, res, next) => {
  // rep.body la id cua User
  // router.delete("/:id/:userName", removeResponsilble);

  try {
    const id = req.params["id"];
    const userName = req.params["userName"];

    if (!id) {
      const exception = new Error(`Add task handle`);
      exception.statusCode = 400;
      throw exception;
    }

    let foundTask = await Task.findById({ id });
    if (!foundTask) {
      const exception = new Error(`Task Not Found`);
      exception.statusCode = 400;
      throw exception;
    }

    let foundUser = await User.find({ name: userName });
    if (!foundUser) {
      const exception = new Error(`Task Not Found`);
      exception.statusCode = 400;
      throw exception;
    }

    let userId = foundUser._id;
    await User.findByIdAndUpdate(
      { userId },
      { $pull: { responsibleTask: id } },
      { new: true }
    );
    await Task.findByIdAndUpdate({ id }, { $in: responsibleBy }, { new: true });
    // if (!foundTask.responsibleBy) {
    //   const exception = new Error(
    //     `Can not remove responsible for unassign Task`
    //   );
    //   exception.statusCode = 400;
    //   throw exception;
    // }

    // const idUserResponsible = foundTask.responsibleBy;

    // await Task.findByIdAndUpdate({ id }, { $in: responsibleBy });
    // // foundUser = await foundUser.save();

    res.status(200).json("Task unassign successful");
  } catch (err) {
    next(err);
  }
};

module.exports = taskController;
