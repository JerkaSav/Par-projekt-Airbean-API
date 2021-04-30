const { db } = require('../db/db-operations');
const { Router } = require('express');
const router = new Router();

router.get('/order/:id', (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  const orders = db.get('orders').filter({ userId: userId }).value();
  console.table(orders);
});

router.get('/coffee', (req, res) => {
  const menu = require('../menu.json');
  res.json(menu);
});

router.post('/order', (req, res) => {
  const order = req.body;
  order.id = nanoid();
  console.log(order);

  const account = db.get('accounts').find({ userid: order.userid }).value();

  const orders = db.get('orders').push(order).write();
  console.log(account, orders);

  const orderTime = new Date();
  console.log(orderTime.getMinutes());
  const orderResult = { eta: orderTime.getMinutes(), orderid: order.id };

  res.json(orderResult);
});

router.post('/account', (req, res) => {
  const account = req.body;
  account.userid = nanoid();

  const usernameExists = db
    .get('accounts')
    .find({ username: account.username })
    .value();
  const emailExists = db.get('accounts').find({ email: account.email }).value();

  const result = {
    success: false,
    usernameExists: false,
    emailExists: false
  };

  if (usernameExists) {
    result.usernameExists = true;
  }
  if (emailExists) {
    result.emailExists = true;
  }
  if (!result.usernameExists && !result.emailExists) {
    db.get('accounts').push(account).write();
    result.success = true;
  }
  res.json(result);
});

module.exports = router;
