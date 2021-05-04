const db = require('./db/db-operations');
const today = new Date();
const menu = require('./menu.json');

function diffTime(orders) {
  let msec = today.getTime() - new Date(orders[i].orderCreated).getTime();
  let mins = Math.floor(msec / 60000);
  let hrs = Math.floor(mins / 60);
  let days = Math.floor(hrs / 24);
  let yrs = Math.floor(days / 365);

  let diff = { orderId: orders[i].id, mins: mins };
  let calMinutes = hrs * 60;
  let calHours = days * 24;
  let caldays = yrs * 365;

  if (mins >= 60) {
    diff = { orderId: orders[i].id, hours: hrs, mins: mins - calMinutes };
  }

  if (hrs >= 24) {
    diff = {
      orderId: orders[i].id,
      days: days,
      hours: hrs - calHours,
      mins: mins - calMinutes
    };
  }

  if (days >= 365) {
    diff = {
      orderId: orders[i].id,
      years: yrs,
      days: days - caldays,
      hours: hrs - calHours,
      mins: mins - calMinutes
    };
  }

  return diff;
}

function calDiffInTime(orders) {
  let orderHistory = [];
  for (i = 0; i < orders.length; i++) {
    orderHistory.push([diffTime(orders)]);

    for (x = 0; x < menu['menu'].length; x++) {
      if (orders[i].itemId[x] === menu['menu'][x].id) {
        orderHistory[i].push({
          title: menu['menu'][x].title,
          price: menu['menu'][x].price
        });
      }
    }
  }
  return orderHistory;
}

module.exports = { calDiffInTime };
