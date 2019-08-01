const express = require("express");
const helmet = require('helmet');
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const AccountsRouter = require('./accounts/accounts-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(session({
  name: 'rozes',
  secret: 'From roses to blues so anyone is true',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: require('./database/dbConfig.js'), // configured instance of knex
    tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
    sidfieldname: 'sid', // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  }),
}));


server.use('/api/', AccountsRouter);

server.get("/", (req, res) => {
  res.send("Nothing to see here. Move on.");
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));