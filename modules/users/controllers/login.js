const mongoose = require("mongoose");
const bcrypy = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "this email doesnt exist";

  const comparePassword = await bcrypy.compare(password, getUser.password);
  if (!comparePassword) throw "email and password do not match!";

  const accessToken = jwtManager(getUser);
  //success response

  res.status(200).json({
    status: "success",
    message: "User logined successfully",
    accessToken: accessToken,
  });
};
module.exports = login;
