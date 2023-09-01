const category = require('../models/category');
const expense = require('../models/expense');
const user = require('../models/user');
const reminder = require('../models/reminder');
const { successResponse, errorResponse } = require('../utils');

function fetchName (uName)  {
  let username;
  if(uName.includes(" ") === true){
    let array = uName.split(' ');
    username = array[0];
  } else {
    username = uName;
  }
  return username;
}

// user
const home = async (req, res) => {
  try {

    let username = fetchName(req.user.userName);
    
    //pie chart
    const userId = req.user._id;
    const expenseData = await expense.find({userId: userId});

    let holder = {};
    expenseData.forEach(function(d) {
      if (holder.hasOwnProperty(d.category)) {
        holder[d.category] = holder[d.category] + d.amount;
      } else {
        holder[d.category] = d.amount;
      }
    });

    let obj2 = [];

    for (var prop in holder) {
      obj2.push({ x: prop, value: holder[prop] });
    }

    //graph
    const array = await expense.find({userId: userId});

    let flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {

      if( flags[array[i].date.getMonth()+1]) { 
          for(let j=0; j< output.length; j++){
              if(output[j].date.getMonth()+1 === array[i].date.getMonth()+1) {
                  output[j].amount = output[j].amount + array[i].amount;
              }
          }
          continue;
      }
      flags[array[i].date.getMonth()+1] = true;
      array[i].month = (array[i].date.getMonth())+1;
      output.push(array[i]);
    }
    
    output.sort((a, b) => {
      return a.month - b.month;
    });

    let expensesArray = [];
    output.forEach(element => {
      let temp = [];
      if(element.month == 1) temp.push("January");
      if(element.month == 2) temp.push("February");
      if(element.month == 3) temp.push("March");
      if(element.month == 4) temp.push("April");
      if(element.month == 5) temp.push("May");
      if(element.month == 6) temp.push("June");
      if(element.month == 7) temp.push("July");
      if(element.month == 8) temp.push("August");
      if(element.month == 9) temp.push("September");
      if(element.month == 10) temp.push("October");
      if(element.month == 11) temp.push("November");
      if(element.month == 12) temp.push("December");
      temp.push((element.amount));
      expensesArray.push(temp);
    });

    console.log(expensesArray);
    console.log(obj2);
    finalArray = [];
    finalArray.push(obj2);
    finalArray.push(expensesArray);
    console.log(finalArray);
    // res.render("home", { expenses1: obj2 });
    res.render("home", { expenses: finalArray, username: username });
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const viewMyExpense = async (req, res) => {
  try {
    let userId = req.user._id;
    let username = fetchName(req.user.userName);
    const expenseData = await expense.find({userId: userId});
    res.render("viewMyExpense", { expenses: expenseData, username: username });
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const addCategoryView = async (req, res) => {
  try { 
      let userId = req.user._id;
      let username = fetchName(req.user.userName);
      const categoryData = await category.find({$or: [{ userId: userId }, { isCommon: true }]});
      res.render("addCategory", {categories: categoryData, username: username});
    } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addExpenseView = async (req, res) => {
  try { 
      let userId = req.user._id;
      let username = fetchName(req.user.userName);
      const categoryData = await category.find({$or: [{ userId: userId }, { isCommon: true }]});
      res.render("addExpense", {categories: categoryData, username: username});
    } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addCategory = async (req, res) => {
  try {

    let userId = req.user._id;

    const payload = {
      userId: userId,
      name: req.body.name,
      isCommon: false,
    };

    // register new user
    const newCategory = new category(payload);
    const insertCategory = await newCategory.save();

    console.log("new category added successful");
    res.redirect("/category");

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addExpense = async (req, res) => {
  try {

    let userId = req.user._id;

    const payload = {
      userId: userId,
      name: req.body.name,
      category: req.body.category,
      date: req.body.date,
      amount: req.body.amount,
      isReimburse: req.body.isReimburse
    };

    // register new user
    const newExpense = new expense(payload);
    const insertExpense = await newExpense.save();

    console.log("Expense Added Successful");
    res.redirect("/myexpense");

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const deleteExpense = async (req, res) => {
  try {
    let expenseId = req.params.id;
    const expenseData = await expense.findByIdAndDelete({ _id: expenseId });
    res.redirect("/myexpense");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

// admin
const viewUser = async (req, res) => {
  try {
    role = 'user'
    const userData = await user.find({role});
    res.render("viewUsers", { users: userData });
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    let userId = req.params.id;
    console.log(userId);
    const userData = await user.findByIdAndDelete({ _id: userId });
    res.redirect("/users");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewAllExpenses = async (req, res) => {
  try {
    const expenseData = await expense.find().populate("userId");
    res.render("viewAllExpenses", { expenses: expenseData });
  } catch(error) {
    console.log(error.message);
  }
};

const viewRequests = async(req, res) => {
  try {
    let isReimburse = 'Yes';
    let status = 'Pending';
    const expenseData = await expense.find({isReimburse, status}).populate("userId");
    res.render("viewRequests", { expenses: expenseData });
  } catch(error) {
    console.log(error.message);
  }
};

const viewApproved = async(req, res) => {
  try {
    let isReimburse = 'Yes';
    let status = 'Approved';
    const expenseData = await expense.find({isReimburse, status}).populate("userId");
    res.render("viewApproved", { expenses: expenseData });
  } catch(error) {
    console.log(error.message);
  }
};

const viewCanceled = async(req, res) => {
  try {
    let isReimburse = 'Yes';
    let status = 'Canceled';
    const expenseData = await expense.find({isReimburse, status}).populate("userId");
    res.render("viewCanceled", { expenses: expenseData });
  } catch(error) {
    console.log(error.message);
  }
};

const approveExpense = async(req, res) => {
  try {
    let expenseId = req.params.id;
    let status = 'Approved';
    const expenseData = await expense.findByIdAndUpdate(expenseId, {
      status :status,
    });
    res.redirect('/requests');
  } catch(error) {
    console.log(error.message);
  }
};

const cancelExpense = async(req, res) => {
  try {
    let expenseId = req.params.id;
    let status = 'Canceled';
    const expenseData = await expense.findByIdAndUpdate({_id: expenseId}, {
      status: status,
    });
    res.redirect('/requests');
  } catch(error) {
    console.log(error.message);
  }
};
 
const addReminderView = async(req, res) => {
  try {
    let username = fetchName(req.user.userName);
    res.render('addReminderView', {username: username});
  } catch(error) {
    console.log(error.message);
  }
};

const addReminder = async(req, res) => {
  try {
    let userId = req.user._id;
    const userData = await user.findOne({_id: userId});

    const payload = 
    {
      userId: userId,
      emailID: userData.emailID,
      date: req.body.date,
      subject: req.body.subject,
      body: req.body.body,
      interval: req.body.interval
    };

    // register new user
    const newReminder = new reminder(payload);
    const insertReminder = await newReminder.save();

    console.log("Reminder Added Successful");
    res.redirect("/allreminders"); 
  } catch(error) {
    console.log(error.message);
  }
};

const viewAllReminders = async(req, res) => {
  try {
    let userId = req.user._id;
    
    let username = fetchName(req.user.userName);

    const reminderData = await reminder.find({userId: userId});
    res.render("viewMyReminder", { reminders: reminderData, username: username });
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const deleteReminder = async(req, res) => {
  try {
    let reminderId = req.params.id;
    const userData = await reminder.findByIdAndDelete({ _id: reminderId });
    res.redirect("/allreminders");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};


module.exports = { 
  addReminderView,
  addReminder,
  viewAllReminders,
  deleteReminder, 
  home, 
  addCategory, 
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
  addCategoryView
};
