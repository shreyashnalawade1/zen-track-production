const mongoose = require('mongoose');

const projectPhaseSchema = new mongoose.Schema({
  projectPhaseName: {
    type: String,
    required: [true, 'Please provide a valid project phase Name'],
    maxlength: [200, 'Project phase name must be less than 200 charters long'],
    minlength: [1, 'Project phase name must  be more than 1 charters long'],
  },
  tags: {
    type: [String],
  },
  deadLine: {
    type: Date,
    required: [true, 'Please provide a valid deadline for the project phase  '],
    validate: [
      (val) => val.getTime() >= Date.now(),
      'Please provide a valide deadline value for project phase',
    ],
  },
});

const ProjectPhase = mongoose.model('ProjectPhase', projectPhaseSchema);
ProjectPhase.init();

module.exports = ProjectPhase;
