const { Order } = require('../models/Order');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const User = require('../models/User');
const WorkOrder = require('../models/WorkOrder');

exports.getWorkOrders = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const workOrders = await WorkOrder.find({}, { __v: 0 });

    res.render('work_orders', {
        name: userProfile.nickname,
        workOrders,
    });
};

exports.editOngoingProject = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).lean();
        const users = await User.find({});
        const deliveries = await DeliveryPlace.find({ orderId });

        // const delivery = await DeliveryPlace.findById(
        //     orderId
        // ).populate('orderId');
        // const order = await Order.findById(delivery.orderId._id);

        // if (!delivery) return res.redirect('/');

        const username = await User.findOne({
            email: req.user.emails[0].value,
        });

        // let ticket$ = await DevTicket.findOne({ User: username._id });

        // if (!ticket$) {
        //     ticket$ = { _id: 'dummy' };
        // }

        res.render('edit-ongoing-project', {
            name: userProfile.nickname,
            order,
            deliveries,
            // delivery,
            users,
            user: username,
            // ticket: ticket$,
            editing: true,
            user$: req.user,
        });
    } catch (error) {
        console.log(error);
    }
};
