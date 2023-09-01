const express = require('express');
const { auth } = require("../middlewares/auth");

const {
  viewMyExpense, 
  addExpense, 
  addExpenseView, 
  deleteExpense, 
  viewUser, 
  deleteUser, 
  viewAllExpenses, 
  viewRequests, 
  viewApproved, 
  viewCanceled, 
  approveExpense, 
  cancelExpense,
  home,
  addReminderView,
  addReminder,
  viewAllReminders,
  deleteReminder,
  addCategory,
  addCategoryView,
} = require('../controllers/expense.controller');

const route = express.Router();

route.get('/home', auth, home);
route.get('/myexpense', auth, viewMyExpense);
route.get('/expense', auth, addExpenseView);
route.post('/expense', auth, addExpense);
route.get('/expens/:id', auth, deleteExpense);

route.get('/users', auth, viewUser);
route.get('/user/:id', auth, deleteUser);

route.get('/category', auth, addCategoryView);
route.post('/category', auth, addCategory);
route.get('/expenses', auth, viewAllExpenses);
route.get('/approved', auth, viewApproved);
route.get('/canceled', auth, viewCanceled);
route.get('/requests', auth, viewRequests);

route.get('/approve/:id', auth, approveExpense);
route.get('/cancel/:id', auth, cancelExpense);

route.get('/reminder', auth, addReminderView);
route.post('/reminder', auth, addReminder);
route.get('/allreminders', auth, viewAllReminders);
route.get('/reminder/:id', auth, deleteReminder);

module.exports = route;