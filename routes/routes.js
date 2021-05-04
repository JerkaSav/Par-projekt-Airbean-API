const { db } = require('../db/db-operations');
const { Router } = require('express');
const router = new Router();
const { nanoid } = require('nanoid');
const menu = require('../menu.json');
const { calDiffInTime } = require('../functions');

router.get('/coffee', (req, res) => {
  res.json(menu);
});

// Create Order
router.post('/order', (req, res) => {
  const orderTime = new Date();
  const order = req.body;
  order.id = nanoid();
  // console.log(order);
  order.orderCreated = orderTime;
  const account = db.get('accounts').find({ userid: order.userid }).value();

  db.get('orders').push(order).write();
  // console.log(account, orders);

  console.log(orderTime.getMinutes());
  const orderResult = {
    eta: orderTime.getMinutes(),
    orderid: order.id
  };

  res.json(orderResult);
});

// Find order history
router.get('/order/:id', (req, res) => {
  const userId = req.params.id;
  const orders = db.get('orders').filter({ userId: userId }).value();
  res.json(calDiffInTime(orders));
});

// Create account
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
