const express = require("express");
const server = express();
const AccountsRouter = require('./accounts/accounts-router');

server.use(express.json());
server.use('/api/', AccountsRouter);

server.get("/", (req, res) => {
  res.send("Nothing to see here. Move on.");
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));