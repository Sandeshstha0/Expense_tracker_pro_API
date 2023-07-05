const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const userModel = mongoose.model("users");

  const { email, new_password, reset_code } = req.body;

  if (!email) throw "Email is required";
  if (!new_password) throw "Please provide new password";
  if (!reset_code) throw "Reset code is reuired";
  if (new_password.length < 5) throw "Password need to be 5 character long";

  const getUserWithResetCode = await userModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUserWithResetCode) throw "Reset code doesnt match!";

  //hash password
  const hashedPassword = await bcrypt.hash(new_password, 12);

  await userModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword,
      reset_code: "",
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password is reseted successfully! If you have not done this please contact us!",
    "Your password is reseted successfully! If you have not done this please contact us!",
    "Password Reset successfully"
  );

  res.status(200).json({
    status: "Password changed successfully",
  });
};

module.exports = resetPassword;
