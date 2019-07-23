const express = require("express");
const session = require("express-session");
const server = express();
const AccountsRouter = require('./accounts/accounts-router');

server.use(
  session({
    name: 'rozhes',
    secret: 'nobody tosses a dwarf!',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
      httpOnly: true,
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);
server.use(express.json());
server.use('/api/', AccountsRouter);

server.get("/", (req, res) => {
  res.send("Nothing to see here. Move on.");
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));