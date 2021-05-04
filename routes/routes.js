const { db } = require('../db/db-operations');
const { Router } = require('express');
const router = new Router();
const { nanoid } = require('nanoid');
const menu = require('../menu.json');
// console.log(menu);
// for (var key of Object.keys(menu)) {
//   console.log(Object.keys(menu));
//   console.log(key);
//   console.table(menu['menu'][0].id);
// }
// Get menu
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
  const today = new Date();
  const userId = req.params.id;
  // console.log(userId);
  const orders = db.get('orders').filter({ userId: userId }).value();

  // console.log(orders[0].itemId[0]);
  let orderHistory = [];
  for (i = 0; i < orders.length; i++) {
    let msec = today.getTime() - new Date(orders[i].orderCreated).getTime();
    let mins = Math.floor(msec / 60000);
    let hrs = Math.floor(mins / 60);
    let days = Math.floor(hrs / 24);
    let yrs = Math.floor(days / 365);
    console.log('år:', yrs, 'dagar:', days, 'Tid:', hrs, 'H :', mins, 'M');
    let diff = { Hours: hrs, Mins: mins };

    orderHistory.push([orders[i].id, diff]);
    for (x = 0; x < menu['menu'].length; x++) {
      if (orders[i].itemId[x] === menu['menu'][x].id) {
        orderHistory[i].push({
          title: menu['menu'][x].title,
          price: menu['menu'][x].price
        });
      }
    }
  }
  // console.log(orderHistory);
  res.json(orderHistory);
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
