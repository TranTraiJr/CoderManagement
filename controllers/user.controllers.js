const User = require("../models/User");

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, role } = req.body;

  try {
    //always remember to control your inputs
    if (!name) {
      const exception = new Error(`Missing user's information`);
      exception.statusCode = 400;
      throw exception;
    }

    const validate = await User.find({ name: name });
    const isValidate = Object.keys(validate);
    if (isValidate.length) {
      const exception = new Error(`Name already exist`);
      exception.statusCode = 400;
      throw exception;
    }
    //in real project you must also check if id (referenceTo) is valid as well as if document with given id is exist before any futher process
    //mongoose query
    const result = await User.create({ name, role });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

userController.findUser = async (req, res, next) => {
  try {
    const id = req.params["id"];
    console.log("huhu", id);
    //always remember to control your inputs
    if (!id) {
      const exception = new Error(`Invalid ID`);
      exception.statusCode = 400;
      throw exception;
    }
    const result = await User.findById(id);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

userController.getAllUser = async (req, res, next) => {
  const filter = {};
  try {
    const listOfFound = await User.find(filter).populate("responsibleTask");
    const data = {
      users: listOfFound,
      message: "Get User List Successfully!",
    };

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

module.exports = userController;
