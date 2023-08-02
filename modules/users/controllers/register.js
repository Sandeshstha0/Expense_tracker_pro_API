const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const userModel = mongoose.model("users");

  const { email, password, confirm_password, name, balance } = req.body;

  //validations...
  if (!email) throw "email must be provided";
  if (!password) throw "Password must be provided";
  if (password.length < 8) throw "Password must be at least 8 characters";
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    throw "Password must include lowercase and uppercase letters, numbers, and special characters";
  }
  if (password.includes(name)) throw "Password cannot contain your name";
  if (password === email) throw "Password cannot be the same as your email";
  if (!name) throw "Name is required";
  if (password !== confirm_password) throw "Password need to be same";

  const getDuplicateEmail = await userModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exist ! Please try new one";

  //hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await userModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);

  await emailManager(
    createdUser.email,
    "Welcome to expense tracker PRO . We hope you can manage your expense easily from our platform!",
    "<h1>Welcome to expense tracker PRO .</h1> <br/> <br/>We hop you can manage your expense easily from our platform!",
    "Welcome to Expense Tracker PRO!"
  );

  res.status(201).json({
    status: "User registered successfully",
    accessToken: accessToken,
  });
};

module.exports = register;
