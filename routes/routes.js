const { Router } = require('express');
const router = new Router();
const { db } = require('../server');

router.get('/order/:id', (req, res) => {
  const userId = req.params.id
   console.log(userId)
   const orders = db.get('orders').filter({ userId: userId }).value();
   console.table(orders)
});

module.exports = router;
