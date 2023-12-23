const Project = require('../models/projectModel');
const User = require('../models/userModel');

const handleFactory = require('./handlefactory');

exports.createProject = async function (req, res, next) {
  req.body.team = req.body.team.map(async (el) => {
    const x = await User.find({ email: el }).select('_id');
    // console.log(x[0]._id);
    return x[0]._id;
  });
  req.body.team = await Promise.all(req.body.team);

  // console.log(req.body);

  // return res.status(200).send();

  const item = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      item,
    },
  });
};
exports.getProject = handleFactory.getOne(Project);
exports.getAllProjects = async function (req, res, next) {
  const items = await Project.find({
    team: req.query.userId,
  });
  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
};
exports.deleteProject = handleFactory.deleteOne(Project);
exports.updateProject = handleFactory.UpdateOne(Project);
