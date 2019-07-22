const express = require("express");
const bcrypt = require("bcrypt");
const Accounts = require("./accounts-model");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Shhh🤫hhhh, it works.");
});

router.get("/users", restrictedAccess, (req, res) => {
  Accounts.list()
    .then(accounts => {
      res.status(201).json(accounts);
    })
    .catch(error => {
      res.status(500).json({
        message: error
      });
    });
});

router.post("/register", (req, res) => {
  const account = req.body;
  account.password = bcrypt.hashSync(account.password, 12);

  Accounts.add(account)
    .then(success => {
      console.log(success);
      res.status(201).json(success);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/login", authCheckpoint, (req, res, next) => {
  try {
    const account = req.account;
    res.status(200).json({
      message: `Welcome ${account.username}!`
    });
  } catch (error) {
    next(new Error(error.message));
  }
});

function authCheckpoint(req, res, next) {
  const { username, password } = req.body;

  Accounts.findByUsername({ username })
    .first()
    .then(account => {
      if (!account || !bcrypt.compareSync(password, account.password)) {
        res.status(401).json({ message: "Wrong credentials" });
      } else {
        req.account = account;
        next();
      }
    })
    .catch(error => {
      next(new Error(error.message));
    });
}

function restrictedAccess(req, res, next) {
  const { username, password } = req.headers;

  Accounts.findByUsername({ username })
    .first()
    .then(account => {
      if (!account || !bcrypt.compareSync(password, account.password)) {
        res.status(401).json({ message: "Wrong credentials" });
      } else {
        req.account = account;
        next();
      }
    })
    .catch(error => {
      next(new Error(error.message));
    });
}

module.exports = router;
