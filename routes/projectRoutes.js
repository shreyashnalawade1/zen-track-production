const express = require('express');

const projectController = require('../controllers/projectController');

const router = express.Router();
router
  .route('/')
  .post(projectController.createProject)
  .get(projectController.getAllProjects);

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
