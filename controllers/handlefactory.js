exports.deleteOne = function (Model) {
  return async function (req, res, next) {
    const { id } = req.params;
    await Model.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  };
};

exports.UpdateOne = function (Model) {
  return async function (req, res, next) {
    const { id } = req.params;
    const item = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        item,
      },
    });
  };
};

exports.getAll = function (Model) {
  return async function (req, res, next) {
    const items = await Model.find();
    res.status(200).json({
      status: 'success',
      data: {
        items,
      },
    });
  };
};

exports.getOne = function (Model, populateOpt) {
  return async function (req, res, next) {
    const { id } = req.params;
    if (!id) {
      return next('Please provide a valid req Id');
    }
    let item;
    if (populateOpt) {
      item = await Model.findById(id).populate({
        path: populateOpt.path,
        strictPopulate: false,
        select: populateOpt.select,
      });
    } else {
      item = await Model.findById(id);
    }
    if (!item) {
      return next('No Item is found with the Id');
    }
    res.status(200).json({
      status: 'success',
      data: {
        item,
      },
    });
  };
};

exports.createOne = function (Model) {
  return async function (req, res, next) {
    const item = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        item,
      },
    });
  };
};
