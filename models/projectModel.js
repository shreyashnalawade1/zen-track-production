const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Please provide a valid project Name'],
    maxlength: [200, 'Project name must be less than 200 charters long'],
    minlength: [1, 'Project name must  be more than 1 charters long'],
  },
  tags: {
    type: [String],
  },
  discription: {
    type: String,
    required: [true, 'Please provide a discription'],
    maxlength: [600, 'Project dicription must be less than 600 charters long'],
    minlength: [1, 'Project discription must  be more than 1 charters long'],
  },
  team: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
const Project = mongoose.model('Project', projectSchema);
Project.init();

module.exports = Project;
