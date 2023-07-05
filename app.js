require("express-async-errors");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./handler/errorHandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
require("dotenv").config();

const app = express();

app.use(cors());

mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("Connection to mongodb successful!");
  })
  .catch(() => {
    console.log("Connection to mongodb failed!");
  });

//Models initialization
require("./models/userModel");
require("./models/transactions.model ");

app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

//end of all routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not found",
  });
});
app.use(errorHandler);

app.listen(9000, () => {
  console.log("server is running");
});
