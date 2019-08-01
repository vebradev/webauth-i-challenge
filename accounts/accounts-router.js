const express = require("express");
const bcrypt = require("bcrypt");
const md5 = require("md5");
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
      res.status(201).json(success);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/sillyRegister", (req, res) => {
  const account = req.body;
  account.password = sillyCrypt.hash(account.password, 12);

  Accounts.add(account)
    .then(success => {
      res.status(201).json(success);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/sillyLogin", sillyAuth, (req, res, next) => {
  try {
    const account = req.account;
    res.status(200).json({
      message: `Welcome ${account.username}!`
    });
  } catch (error) {
    next(new Error(error.message));
  }
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
      if (!bcrypt.compare(password, account.password)) {
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

function sillyAuth(req, res, next) {
  const { username, password } = req.body;

  Accounts.findByUsername({ username })
    .first()
    .then(account => {
      if (!sillyCrypt.compare(password, account.password)) {
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
        next();
      }
    })
    .catch(error => {
      next(new Error(error.message));
    });
}

// Works!
const sillyCrypt = {
  hash(password, cycles = 10, salty = "") {
    const salt = salty ? salty : new Date().getTime();
    let hash = password + salt;
    for (let i = 0; i < cycles; i++) {
      hash = md5(hash);
    }
    return `${hash}$${cycles}$${salt}`;
  },
  compare(password, storedPassword) {
    const chain = storedPassword.split("$");
    return this.hash(password, chain[1], chain[2]) === storedPassword;
  }
};

module.exports = router;