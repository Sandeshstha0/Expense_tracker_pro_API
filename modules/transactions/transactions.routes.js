const express = require("express");

const auth = require("../../middleware/auth");
const addIncome = require("./controllers/addincome");
const addExpense = require("./controllers/addExpense");
const getTransactions = require("./controllers/getTransactions");
const deleteTransatcion = require("./controllers/deleteTransaction");
const editTransaction = require("./controllers/editTransaction");
const transactionRoutes = express.Router();

//Routes

transactionRoutes.use(auth);

//protected routes
transactionRoutes.post("/addIncome", addIncome);
transactionRoutes.post("/addExpense", addExpense);
transactionRoutes.get("/", getTransactions);

transactionRoutes.delete("/:transaction_id",deleteTransatcion)
transactionRoutes.patch("/",editTransaction)

module.exports = transactionRoutes;
