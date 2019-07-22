const db = require("../database/dbConfig");

module.exports = {
  add,
  findById,
  findByUsername,
  list
};

function add(account) {
  return db("accounts")
    .insert(account, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findByUsername(username) {
  return db("accounts").where(username);
}

function findById(id) {
  return db("accounts")
    .where({ id })
    .first();
}

function list() {
  return db("accounts")
    .select("username");
}
