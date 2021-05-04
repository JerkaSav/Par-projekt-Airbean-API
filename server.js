const express = require('express');

const routes = require('./routes/routes');
const { db } = require('./db/db-operations');

const app = express();
app.use(express.json());
app.use('/api', routes);

function initiateDataBase() {
  db.defaults({ accounts: [], orders: [] }).write();
}

app.listen(9999, () => {
  console.log('Server on 9999');
  initiateDataBase();
});
