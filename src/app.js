const express = require('express');
const userRoutes = require('./routes/user.routes');
const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');
const balanceRoutes = require('./routes/balance.routes');
const settlementRoutes = require('./routes/settlement.routes');



const app = express();

app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/settlements', settlementRoutes);



// health
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;
