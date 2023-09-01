const dotenv = require('dotenv');
dotenv.config();
require('./src/db/connection');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const { cronFunction } = require('./src/utils/cron');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const userRoutes = require('./src/routes/user');
const expenseRoutes = require('./src/routes/expense');

const app = express();
const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/src/public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(cookieParser());
app.use('/', userRoutes);
app.use('/', expenseRoutes);

// for everyday
//cron.schedule("0 2 * * *", function() {
//    cronFunction();
// });

// for per minutes for demo
// cron.schedule("* * * * *", function() {
//     cronFunction();
// });

/* --- google authetication --- */

app.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));
  
app.get( '/auth/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
}));
  
app.get('/auth/callback/success' , (req , res) => {
    if(!req.user)
        res.redirect('/auth/callback/failure');
    res.send("Welcome " + req.user.email);
});
  
app.get('/auth/callback/failure' , (req , res) => {
    res.send("Error");
})

/* --- google authetication --- */

app.listen(port, () => {
    console.log(`connection is live at port ${port}`);
});