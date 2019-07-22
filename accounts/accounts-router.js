const express = require('express');
const Accounts = require('./accounts-model');
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Shhh🤫hhhh, it works.");
})

module.exports = router;