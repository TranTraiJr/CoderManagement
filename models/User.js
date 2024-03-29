const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager", "employee"],
      required: true,
      default: "employee",
    },
    responsibleTask: { type: mongoose.SchemaTypes.ObjectId, ref: "Task" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
