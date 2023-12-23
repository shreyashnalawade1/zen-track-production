const express = require('express');

const resourceGroupController = require('../controllers/resourceGroupController');

const router = express.Router();

router
  .route('/')
  .post(resourceGroupController.createResourceGroup)
  .get(resourceGroupController.getAllResourceGroups);

router
  .route('/:id')
  .get(resourceGroupController.getResourceGroup)
  .patch(resourceGroupController.updateResourceGroup)
  .delete(resourceGroupController.deleteResourceGroup);

module.exports = router;
