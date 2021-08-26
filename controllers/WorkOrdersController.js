const { Order } = require('../models/Order');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');

exports.getWorkOrders = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;

    const [workOrders, users] = await Promise.all([
        WorkOrder.find({}, { __v: 0 }),
        User.find({}, { __v: 0 }),
    ]);

    res.render('work_orders', {
        name: userProfile.nickname,
        workOrders,
        users,
    });
};

exports.postWorkOrder = async (req, res, next) => {
    await WorkOrder.create({
        ...req.body,
        user: req.user.nickname,
    });
    res.status(200).send();
};
