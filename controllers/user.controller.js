const bcrypt = require("bcryptjs");
const user = require("../models/user");
const { successResponse, errorResponse } = require("../utils");
const { sendmail } = require('../utils/mail');
const secretKey = 'Secret';

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

const login = async (req, res) => {
  try {
    const emailID = req.body.emailID;
    const password = req.body.password;
    let message;
    // check for email exist or not
    const userData = await user.findOne({ emailID: emailID, isVerified: true });
    if (!userData) {
      message = 'Email id is not registered';
      console.log(message);
      res.render("login", {message: message});
    }
    else {
      // check for the password
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        message = 'Password is incorrect';
        console.log(message);
        res.render("login", {message: message});

        // return errorResponse(req, res, 'Invalid credentials!', 404);
      } else {
        // jwt token created
        let accessToken = userData.getToken({
          exp: 60 * 60,
          secret: secretKey,
        });

        res.cookie("accessToken", accessToken);
        await userData.save();
        if (userData.role === "admin")      
          res.redirect("/expenses");
        else
          if(userData.address == '')
            res.redirect("/profile");
          else
            res.redirect("/home");
      }
   }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong!", 400, {
      err: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { emailID, password,  userName} = new user(req.body);
    const role = 'user';
    // check if email id allready exist
    const userData = await user.findOne({ emailID: emailID });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        userName,
        emailID,
        password,
        role,
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("Registration Successful");
      const link = process.env.LINK;
      sendmail(
        emailID,
        "Email Verification For Fintrak",
        ` <p> Hello </p><strong> ${userName}, </strong> </br>
          <p> You have successfully registered for Fintrack. Please click on below link to verify the email id.</p>
          <a href="${link}/verification/${emailID}">Click Here</a>
          <p> Thank You!!</p>`
      );

      res.render("login", {message: ''});
      // return successResponse(req, res, insertUser, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const verification = async (req, res) => {
  try {
    const emailID = req.params.emailID; 
    const updateDetails = await user.findOneAndUpdate({emailID: emailID}, {isVerified : true});
    const link = process.env.LINK;
    res.redirect(link);
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const loginView = async (req, res) => {
  let message = '';
  res.render("login", {message: message});
};

const viewProfile = async (req, res) => {
  try {
    const id = req.user._id;
    let username = fetchName(req.user.userName);
    console.log(id);  
    let userData = await user.findOne({ _id: id });
    res.render("userProfile", { users: userData, username: username });
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const updateProfile = async (req, res) => {
  try {
    let userId = req.user._id;

      // updating user details
    const updateDetails = await user.findByIdAndUpdate(userId, {
      userName : req.body.userName,
      emailID : req.body.emailID,
      address : req.body.address,
      city : req.body.city,
      state : req.body.state,
      country : req.body.country,
      pincode : req.body.pincode,
      companyName : req.body.companyName,
      employeeID : req.body.employeeID,
    });
    
    const userData = await user.findOne({ _id: userId });

    if (!userData) {
      return errorResponse(req, res, "User Not Found", 404);
    } else {
      res.render("userProfile", { users: userData });
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.redirect("/");
  } catch (error) {
    return errorResponse(req, res, "Error while logging out", 500);
  }
};

const addAdminView = async (req, res) => {
  res.render("addAdmins");
}

const viewAllAdmins = async (req, res) => {
  try {
    role = 'admin'
    const userData = await user.find({role});
    res.render("viewAdmins", { users: userData });
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
}

const deleteAdmin = async (req, res) => {
  try {
    let userId = req.params.id;
    const userData = await user.findByIdAndDelete({ _id: userId });
    res.redirect("/alladmin");
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { emailID, password,  userName} = new user(req.body);
    const role = 'admin';
    // check if email id allready exist
    const userData = await user.findOne({ emailID: emailID });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        userName,
        emailID,
        password,
        role,
        isVerified: true,
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("new admin added successfully");
      const link = process.env.LINK;
      sendmail(
        emailID,
        "Credentials From Fintrak",
        ` <p> Hello </p><strong> ${userName}, </strong> </br>
          <p> You have been successfully added for admin role on Fintrack. Please use the below credentials for sign in.</p>
          <p><b>Email Id: </b> ${emailID}</p>
          <p><b>Password: </b> ${password}</p>
          <p>To access Fintrak <a href="${link}">click here</a></p>
          <p> Thank You!!</p>`
      );

      res.redirect('/alladmin');
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const sendLink = async (req, res) => {
  try{
    const link = process.env.LINK;
    const emailID = req.body.emailID;
    const userData = await user.findOne({ emailID: emailID, isVerified: true });
    if(userData) {
      sendmail(
        userData.emailID,
        "Foget password link in fintrak",
        ` <p> Hello </p><strong> ${userData.userName}, </strong> </br>
          <p> To change password <a href="${link}/change/${userData.emailID}">click here</a></p>
          <p> Thank You!!</p>`
      );
    }
  } catch(err){
    console.log(err.message);
  }
}

const forgetView = async (req, res) => {
  res.render('forgetPage');
}

const changePasswordView = async (req, res) => {
  const emailID = req.params.emailID;
  res.render("changePassword", {emailID: emailID});
}

const changePassword = async (req, res) => {
  try{
    const emailID = req.body.emailID;
    let password = await bcrypt.hash(req.body.password, 10);
    const userData = await user.findOne({ emailID: emailID });
    console.log(userData);
    const updateDetails = await user.findByIdAndUpdate(userData._id, {
      password : password,
    });
    res.render("login", {message: 'Password changed successfully'});
  } catch(err){
    console.log(err.message);
    res.render("login", {message: 'Password has not been updated'});
  }
}

module.exports = {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  updateProfile,
  verification,
  addAdmin,
  addAdminView,
  deleteAdmin,
  viewAllAdmins,
  forgetView,
  sendLink,
  changePassword,
  changePasswordView,
};