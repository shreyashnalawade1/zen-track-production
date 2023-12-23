const User = require('../models/userModel');
const handleFactory = require('./handlefactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = async function (req, res, next) {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      'This route is not for password updates. Please use /updateMyPassword.',
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.searchUser = async function (req, res, next) {
  const { name } = req.query;
  // regex does pattern matching for the given string
  // todo search ho this regex thingy works
  // i option to perform case insensistive regex check
  const users = await User.find({
    name: { $regex: name, $options: 'i' },
    _id: { $ne: req.user.id },
  });

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};

exports.createUser = handleFactory.createOne(User);
exports.getUser = handleFactory.getOne(User);
exports.getAllUsers = handleFactory.getAll(User);
exports.deleteUser = handleFactory.deleteOne(User);
exports.updateUser = handleFactory.UpdateOne(User);
