const { Order } = require('../models/Order');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const User = require('../models/User');
const DevTicket = require('../models/DevTicket');

exports.getOngoingProjects = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const deliveries = await DeliveryPlace.find().populate('orderId');
    Order.find()
        .then((orders) => {
            res.render('ongoing_projects', {
                name: userProfile.nickname,
                orders,
                deliveries,
                editing: true,
            });
        })
        .catch((err) => console.log(err));
};

exports.editOngoingProject = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).lean();
        const users = await User.find({});
        const deliveries = await DeliveryPlace.find({ orderId });

        console.log('rahil ', orderId);

        // const delivery = await DeliveryPlace.findById(
        //     orderId
        // ).populate('orderId');
        // const order = await Order.findById(delivery.orderId._id);

        // if (!delivery) return res.redirect('/');

        const username = await User.findOne({
            email: req.user.emails[0].value,
        });

        let ticket$ = await DevTicket.findOne({ User: username._id });

        if (!ticket$) {
            ticket$ = { _id: 'dummy' };
        }

        res.render('edit-ongoing-project', {
            name: userProfile.nickname,
            order,
            deliveries,
            // delivery,
            users,
            user: username,
            ticket: ticket$,
            editing: true,
            user$: req.user,
        });
    } catch (error) {
        console.log(error);
    }
};
