const express = require('express');

const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .post('/', authController.protect, messageController.message)
  .get('/:id', messageController.getAllMessage);

module.exports = router;
