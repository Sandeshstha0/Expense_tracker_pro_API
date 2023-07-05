const mongoose = require("mongoose");

const getTransactions = async (req, res) => {
  const transactionModel = mongoose.model("transactions");

  console.log(req.query);

  const transactions = await transactionModel.find({
    user_id: req.user._id,
    ...req.query, //spread operator
  });
  res.status(200).json({
    status: "success",
    data: transactions,
  });
};

module.exports = getTransactions;
