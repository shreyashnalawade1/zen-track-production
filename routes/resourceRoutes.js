const express = require('express');

const resourceController = require('../controllers/resourceController');

const router = express.Router();

router
  .route('/')
  .post(resourceController.createResource)
  .get(resourceController.getAllResources);

router
  .route('/:id')
  .get(resourceController.getResource)
  .patch(resourceController.updateResource)
  .delete(resourceController.deleteResource);

module.exports = router;
