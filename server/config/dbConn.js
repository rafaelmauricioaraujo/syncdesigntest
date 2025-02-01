const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27018/test-environment?directConnection=true"
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
