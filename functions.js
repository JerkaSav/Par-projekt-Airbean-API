const { writeToDb, findUser } = require('./db/db-operations');
const { nanoid } = require('nanoid');
const today = new Date();
const menu = require('./menu.json');

function diffTime(orders) {
  let msec = today.getTime() - new Date(orders[i].orderCreated).getTime();
  let mins = Math.floor(msec / 60000);
  let hrs = Math.floor(mins / 60);
  let days = Math.floor(hrs / 24);
  let yrs = Math.floor(days / 365);

  let diff = {
    orderDone: false,
    orderId: orders[i].id,
    OrderlifeTime: { mins: mins }
  };
  let calMinutes = hrs * 60;
  let calHours = days * 24;
  let caldays = yrs * 365;
  if (mins > orders[i].eta) {
    diff.orderDone = true;
  }
  if (!diff.orderDone) {
    diff.timeLeft = orders[i].eta - mins;
  }

  if (mins >= 60) {
    diff = {
      orderId: orders[i].id,
      OrderlifeTime: { hours: hrs, mins: mins - calMinutes }
    };

    if (hrs >= 24) {
      diff = {
        orderId: orders[i].id,
        OrderlifeTime: {
          days: days,
          hours: hrs - calHours,
          mins: mins - calMinutes
        }
      };

      if (days >= 365) {
        diff = {
          orderId: orders[i].id,
          OrderlifeTime: {
            years: yrs,
            days: days - caldays,
            hours: hrs - calHours,
            mins: mins - calMinutes
          }
        };
      }
    }
  }

  return diff;
}

function calDiffInTime(orders) {
  let orderHistory = [];
  for (i = 0; i < orders.length; i++) {
    orderHistory.push([diffTime(orders)]);

    for (x = 0; x < orders[i].itemId.length; x++) {
      const findId = menu['menu'].find(
        (element) => element.id === orders[i].itemId[x]
      );

      orderHistory[i].push({
        title: findId.title,
        price: findId.price
      });
    }
  }
  return orderHistory;
}

function checkUser(account) {
  const usernameExists = findUser('username', account.username);
  const emailExists = findUser('email', account.email);
  account.userid = nanoid();

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
    writeToDb('accounts', account);
    result.success = true;
  }
  return result;
}

function createOrder(order) {
  order.orderCreated = today;
  order.id = nanoid();
  order.eta = Math.floor(Math.random() * 15) + 2;
  writeToDb('orders', order);
  const orderResult = {
    eta: order.eta,
    orderid: order.id
  };
  return orderResult;
}

module.exports = { calDiffInTime, checkUser, createOrder };
