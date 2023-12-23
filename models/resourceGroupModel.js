const mongoose = require('mongoose');

const resourceGroupSchema = new mongoose.Schema(
  {
    resourceGroupName: {
      type: String,
      required: [true, 'Please provide a valid Resource Group Name'],
      maxlength: [
        200,
        'Resource Group name must be less than 200 charters long',
      ],
      minlength: [1, 'Resource Group name must  be more than 1 charters long'],
    },
    numResource: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      deafult: Date.now(),
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'A resource group must be associated with a project'],
    },
  },
  {
    timestamps: true,
  },
);

const ResourceGroup = mongoose.model('ResourceGroup', resourceGroupSchema);
ResourceGroup.init();
module.exports = ResourceGroup;
