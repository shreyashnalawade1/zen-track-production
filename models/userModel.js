const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const { PassThrough } = require('stream');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide valid a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide valid a email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  photo: {
    type: String,
    default: `default-${Math.floor(Math.random() * (10 - 1) + 1)}.jpg`,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: [
      function (val) {
        return val === this.password;
      },
      'Passwords are not the same!',
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // if password is not modified or a new document is created do not set the passwordChanged value
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  password,
  orignalpassword,
) {
  return await bcrypt.compare(password, orignalpassword);
};

userSchema.methods.ifPasswordChangedAfterIssue = function (issueStamp) {
  if (!this.passwordChangedAt) return false;
  // console.log(issueDate);
  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10,
  );
  // issueStamp:is the time stamp in seconds
  return issueStamp < changedTimestamp;
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
User.init();

module.exports = User;
