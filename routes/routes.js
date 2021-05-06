const { filterOrders } = require('../db/db-operations');
const { Router } = require('express');
const router = new Router();
const menu = require('../menu.json');
const { calDiffInTime, checkUser, createOrder } = require('../functions');

router.get('/coffee', (req, res) => {
  res.json(menu);
});

// Create Order
router.post('/order', (req, res) => {
  const order = req.body;
  res.json(createOrder(order));
});

// Find order history
router.get('/order/:id', (req, res) => {
  const userId = req.params.id;
  const orders = filterOrders(userId);
  res.json(calDiffInTime(orders));
});

// Create account
router.post('/account', (req, res) => {
  const account = req.body;
  res.json(checkUser(account));
});

module.exports = router;
