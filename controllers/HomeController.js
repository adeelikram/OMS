const { getToken } = require('../config/Token');
const { Order } = require('../models/Order');
const User = require('../models/User');

module.exports.getHome = async (req, res) => {
    const orders = await Order.find({});
    const ordersCount = orders.length;
    const { _raw, _json, ...userProfile } = req.user;
    res.render('orders', {
        orders,
        ordersCount,
        name: userProfile.nickname,
    });
};

