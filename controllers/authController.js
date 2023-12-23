const util = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
/**
 * used for creating token by reciving the payload
 * **/
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * used for creating and sending token
 * **/
const createSendToken = function (user, statusCode, req, res) {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expries: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    // todo check what the secure attributes does
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    secure: true,
    sameSite: 'None',
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
/**
 * used for signup users
 * **/
exports.signup = async function (req, res, next) {
  // creating the new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // todo rember to send email
  createSendToken(newUser, 201, req, res);
};

/**
 * used for login users in
 * **/

exports.login = async function (req, res, next) {
  const { email, password } = req.body;

  //   todo create a error class
  // 1. check if email and password exit
  if (!email || !password) {
    return next('Please provide a valid email and Password');
  }
  //   2. check if user exits && password is correct
  const user = await User.findOne({ $or: [{ email }] }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next('Incorrect email or password');
  }

  //   if everything okay then create and send token
  createSendToken(user, 200, req, res);
};

exports.logout = function (req, res, next) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = async function (req, res, next) {
  // Getting token and check of it's there
  let token;
  const tempToken = req.get('Authorization');
  if (tempToken) {
    token = tempToken.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    token = req.query.token;
  }

  if (!token) {
    return next('You are not logged in! Please log in to get access.');
  }
  // verify the token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_STRING,
  );

  // check if user still exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next('No user found!');
  }
  // check if user changed the password after the take was issuesd

  if (currentUser.ifPasswordChangedAfterIssue(decoded.iat)) {
    return next('Token has expired');
  }
  req.user = currentUser;
  next();
};

/**
 * function to create reset token**/

exports.forgotPassword = async function (req, res, next) {
  // get user for which we need to change password for
  const user = await User.findOne({
    $or: [
      {
        email: req.body.email,
      },
      {
        userName: req.body.userName,
      },
    ],
  });

  if (!user) {
    return next('No user found in with this email');
  }

  // genrate random password reset token
  const resetToken = user.createPasswordReset();
  //   do not run validators as no important information has been changed
  await user.save({ validateBeforeSave: false });

  //todo send email in try catch here
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;
  res.status(200).json({
    status: 'success',
    // todo this is temp way to send the reset url
    resetURL,
  });
};

exports.resetPassword = async function (req, res, next) {
  // find the user who has sent the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // find the users based and hashToken calculated
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next('Reset token is invalid or has expired');
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
};

exports.updatePassword = async function (req, res, next) {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //   This function will run after protect
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next('The password you submited as current password is wrong');
  }

  //   if the password provided by current user is correct then we update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // we do this cause we wanna run all pre save middlewear

  await user.save();

  //   create new token adnd and send it
  createSendToken(user, 200, req, res);
};

exports.current = async function (req, res, next) {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};
