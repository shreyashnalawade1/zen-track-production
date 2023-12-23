const Resource = require('../models/resourceModel');

const handleFactory = require('./handlefactory');

exports.createResource = handleFactory.createOne(Resource);
exports.getResource = handleFactory.getOne(Resource);
exports.getAllResources = async function (req, res, next) {
  const items = await Resource.find({
    group: req.query.groupId,
  }).populate({
    path: 'createdBy',
    select: 'name',
  });
  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
};
exports.deleteResource = handleFactory.deleteOne(Resource);
exports.updateResource = handleFactory.UpdateOne(Resource);
