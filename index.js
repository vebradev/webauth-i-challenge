const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Online");
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));