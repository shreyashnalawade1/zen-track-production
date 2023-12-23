const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();
router
  .route('/')
  .post(teamController.createTeam)
  .get(teamController.getAllTeams);

router
  .route('/:id')
  .get(teamController.getTeam)
  .delete(teamController.deleteTeam)
  .patch(teamController.updateTeam);

module.exports = router;
