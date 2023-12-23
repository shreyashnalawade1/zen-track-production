const Task = require('../models/taskModel');
const User = require('../models/userModel');
const handleFactory = require('./handlefactory');

exports.createTask = async function (req, res, next) {
  req.body.assigned = await User.find({
    email: req.body.assigned,
  }).select('_id');
  req.body.assigned = req.body.assigned[0]._id;
  // console.log(req.body);
  const item = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      item,
    },
  });
};
exports.getTask = handleFactory.getOne(Task, {
  path: 'assigned',
  select: 'name',
});
exports.getAllTasks = async function (req, res, next) {
  const items = await Task.find({
    project: req.query.projectId,
  }).populate({
    path: 'assigned',
    strictPopulate: false,
    select: 'name',
  });
  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
};
exports.deleteTask = handleFactory.deleteOne(Task);
exports.updateTask = handleFactory.UpdateOne(Task);
