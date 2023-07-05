const mongoose = require("mongoose");
const validator = require("validator");

const deleteTransatcion = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const userMode = mongoose.model("users");

  const { transaction_id } = req.params;

  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please Provide a Valid id!";

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "Transaction not found";

  if (getTransaction.transaction_type === "income") {
    //income logic
    await userMode.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: -1 * getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await userMode.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }

  await transactionModel.deleteOne({
    _id: transaction_id,
  });

  res.status(200).json({
    status: "deleted successfully",
  });
};

module.exports = deleteTransatcion;
