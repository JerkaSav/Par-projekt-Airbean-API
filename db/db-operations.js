const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('accounts.json');
const db = lowdb(adapter);

function writeToDb(array, object) {
  db.get(array).push(object).write();
}

function findUser(key, value) {
  if (key === 'username') {
    return db.get('accounts').find({ username: value }).value();
  } else {
    return db.get('accounts').find({ email: value }).value();
  }
}

function filterOrders(userId) {
  return db
    .get('orders')
    .filter({ userId: userId })
    .orderBy('orderCreated', 'desc')
    .value();
}

module.exports = { db, writeToDb, findUser, filterOrders };
