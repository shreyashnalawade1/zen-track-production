const Team = require('../models/teamModel');
const handleFactory = require('./handlefactory');

exports.createTeam = handleFactory.createOne(Team);
exports.getTeam = handleFactory.getOne(Team);
exports.getAllTeams = handleFactory.getAll(Team);
exports.deleteTeam = handleFactory.deleteOne(Team);
exports.updateTeam = handleFactory.UpdateOne(Team);
