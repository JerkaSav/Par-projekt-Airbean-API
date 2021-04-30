// const lowdb = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('accounts.json');
// const db = lowdb(adapter);
const express = require('express');

const routes = require('./routes/routes');
const { db } = require('./db/db-operations');

const app = express();
app.use(express.json());
app.use('/api', routes);

function initiateDataBase() {
  db.defaults({ accounts: [], orders: [] }).write();
}

// app.get('/api/coffee', (req, res) => {
//   const menu = require('./menu.json');
//   res.json(menu);
// });

// app.post('/api/order', (req, res) => {
//   const order = req.body;
//   order.id = nanoid();
//   console.log(order);

//   const account = db.get('accounts').find({ userid: order.userid }).value();

//   const orders = db.get('orders').push(order).write();
//   console.log(account, orders);

//   const orderTime = new Date();
//   console.log(orderTime.getMinutes());
//   const orderResult = { eta: orderTime.getMinutes(), orderid: order.id };

//   res.json(orderResult);
// });

// app.get('/api/order/:id', (req, res) => {
//  const userId = req.params.id;
//  console.log(userId)
//  const orders = db.get('orders').filter({ userId: userId }).value();
//  console.table(orders)
// })

// app.post('/api/account', (req, res) => {
//   const account = req.body;
//   account.userid = nanoid();

//   const usernameExists = db
//     .get('accounts')
//     .find({ username: account.username })
//     .value();
//   const emailExists = db.get('accounts').find({ email: account.email }).value();

//   const result = {
//     success: false,
//     usernameExists: false,
//     emailExists: false
//   };

//   if (usernameExists) {
//     result.usernameExists = true;
//   }
//   if (emailExists) {
//     result.emailExists = true;
//   }
//   if (!result.usernameExists && !result.emailExists) {
//     db.get('accounts').push(account).write();
//     result.success = true;
//   }
//   res.json(result);
// });

app.listen(9999, () => {
  console.log('Server on 9999');
  initiateDataBase();
});

// module.exports = { db };
