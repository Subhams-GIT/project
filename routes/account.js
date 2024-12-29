const express = require("express");

const { account } = require("../db");
const mongoose = require('mongoose');
const accountrouter = express.Router();
const authMiddleware = require("./Middleware");

accountrouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await account.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

accountrouter.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;
    const from = await account.findOne({ userId: req.userId }).session(session);

    if (!from || from.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    const toAccount = await account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: toAccount });
    }

    
    console.log("toAccount:", toAccount);

    
    const updateTo = await account.updateOne(
      { userId: toAccount.userId },
      { $inc: { balance: amount } }
    ).session(session);

    
    console.log("Update toAccount Result:", updateTo);

    
    const updateFrom = await account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    
    console.log("Update fromAccount Result:", updateFrom);

    
    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction Error:", error);
    res.status(500).json({ message: "Transfer failed" });
  } finally {
    session.endSession();
  }
});

module.exports = accountrouter;
