const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, chatController.accessChat)
  .get(authController.protect, chatController.fetchChat);

router.post('/groups', authController.protect, chatController.createGroup);
router.patch('/renameGroup', authController.protect, chatController.renameChat);
router.patch('/addUser', authController.protect, chatController.addUser);
router.patch('/removeUser', authController.protect, chatController.remUser);
module.exports = router;
