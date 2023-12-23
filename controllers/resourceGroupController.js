const ResourceGroup = require('../models/resourceGroupModel');

const handleFactory = require('./handlefactory');

exports.createResourceGroup = handleFactory.createOne(ResourceGroup);
exports.getResourceGroup = handleFactory.getOne(ResourceGroup);
exports.getAllResourceGroups = async function (req, res, next) {
  const items = await ResourceGroup.find({
    project: req.query.projectId,
  });
  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
};
exports.deleteResourceGroup = handleFactory.deleteOne(ResourceGroup);
exports.updateResourceGroup = handleFactory.UpdateOne(ResourceGroup);
