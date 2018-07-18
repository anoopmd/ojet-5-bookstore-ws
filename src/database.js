const NeDB = require('nedb');

const userDB = new NeDB({
  filename: './db-data/users.nedb',
  autoload: true
});

const bookstoreDB = new NeDB({
  filename: './db-data/bookstore.nedb',
  autoload: true
});

const tokenDB = new NeDB({
  filename: './db-data/oauth-token.nedb',
  autoload: true
});

module.exports = {
  userDB: userDB,
  tokenDB: tokenDB,
  bookstoreDB: bookstoreDB
};
