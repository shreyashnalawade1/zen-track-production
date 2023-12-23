const Chat = require('../models/chatModel');

exports.accessChat = async function (req, res, next) {
  const { userId } = req.body;
  if (!userId) {
    return next('No user id found !');
  }
  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: {
          $elemMatch: {
            $eq: req.user.id,
          },
        },
      },
      {
        users: {
          $elemMatch: {
            $eq: userId,
          },
        },
      },
    ],
  })
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate({ path: 'latestMessage', populate: 'sender' });

  if (chat.length > 0) {
    res.status(200).json({
      status: 'success$',
      data: {
        chat: chat[0],
      },
    });
  } else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    const createdChat = await Chat.create(chatData);
    chat = await Chat.findById({ _id: createdChat._id }).populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    );
    res.status(200).json({
      status: 'success',
      data: {
        chat,
      },
    });
  }
};

exports.fetchChat = async function (req, res, next) {
  const chat = await Chat.find({
    users: {
      $elemMatch: { $eq: req.user._id },
    },
  })
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate('latestMessage')
    .populate(
      'groupAdmin',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate({ path: 'latestMessage', populate: 'sender' })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};

exports.createGroup = async function (req, res, next) {
  const { users, name } = req.body;
  //  todo add validators for the model

  let chat = await Chat.create({
    users,
    name,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  chat = await Chat.findById(chat._id)
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate(
      'groupAdmin',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    );

  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};

exports.renameChat = async function (req, res, next) {
  const { chatId, chatName } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    },
  )
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate(
      'groupAdmin',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    );

  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};

exports.addUser = async function (req, res, next) {
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    {
      new: true,
    },
  )
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate(
      'groupAdmin',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    );
  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};

exports.remUser = async function (req, res, next) {
  const { chatId, userId } = req.body;
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
      },
    },
    {
      new: true,
    },
  )
    .populate(
      'users',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    )
    .populate(
      'groupAdmin',
      '-password -passwordChangedAt -passwordResetExpires -passwordResetToken',
    );
  res.status(200).json({
    status: 'success',
    data: {
      chat,
    },
  });
};
