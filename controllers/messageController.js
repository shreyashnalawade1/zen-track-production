const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

exports.message = async function (req, res, next) {
  const message = await Message.create({ ...req.body, sender: req.user._id });
  await Chat.findByIdAndUpdate(
    req.body.chat,
    {
      latestMessage: message._id,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
};

exports.getAllMessage = async function (req, res, next) {
  const messages = await Message.find({
    chat: req.params.id,
  }).sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
};
