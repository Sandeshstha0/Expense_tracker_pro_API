const mongoose = require("mongoose");

const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const userModel = mongoose.model("users");

  const { email } = req.body;
  if (!email) throw "Email is reuired";

  //check if users exist
  const getUser = await userModel.findOne({
    email: email,
  });
  if (!getUser) throw "Email doesnt exist in the system";

  const resetCode = Math.floor(1000 + Math.random() * 90000);

  await userModel.updateOne(
    {
      email: email,
    },
    {
      reset_code: resetCode,
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password reset code is " + resetCode,
    "Your password reset code is " + resetCode,
    "Reset your password - Expense tracker PRO"
  );

  res.status(200).json({
    status: "Reset code send to the email successfully",
  });
};

module.exports = forgotPassword;
