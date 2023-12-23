const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Please provide a Team nmae'],
    maxlength: [200, 'Team name must be less than 200 charters long'],
    minlength: [1, 'Team name must  be more than 1 charters long'],
  },
});

const Team = mongoose.model('Team', teamSchema);
Team.init();

module.exports = Team;
