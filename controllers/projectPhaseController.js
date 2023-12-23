const ProjectPhase = require('../models/projectPhaseModel');

const handleFactory = require('./handlefactory');

exports.createProjectPhase = handleFactory.createOne(ProjectPhase);
exports.getProjectPhases = handleFactory.getOne(ProjectPhase);
exports.getAllProjectPhases = handleFactory.getAll(ProjectPhase);
exports.deleteProjectPhase = handleFactory.deleteOne(ProjectPhase);
exports.updateProjectPhase = handleFactory.UpdateOne(ProjectPhase);
