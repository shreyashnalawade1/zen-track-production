const express = require('express');
const projectPhaseController = require('../controllers/projectPhaseController');

const router = express.Router();

router
  .route('/')
  .get(projectPhaseController.getAllProjectPhases)
  .post(projectPhaseController.createProjectPhase);

router
  .route('/:id')
  .get(projectPhaseController.getProjectPhases)
  .delete(projectPhaseController.deleteProjectPhase)
  .patch(projectPhaseController.updateProjectPhase);

module.exports = router;
