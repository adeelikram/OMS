const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const ActiveUnit = require('../models/ActiveUnit');
const TimeTrack = require('../models/TimeTrack');

exports.getTimeTracks = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;

    const timeTracks = await TimeTrack.find();

    res.render('get_time_tracks', {
        timeTracks,
        name: userProfile.displayName,
    });
};

exports.getCreateTimeTrack = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const projects = await Order.find({}, { customer: 1, manager: 1 }).lean();
    console.log(projects);
    res.render('get_create_time_track', {
        projects,
        name: userProfile.displayName,
    });
};

exports.postCreateTimeTrack = async (req, res, next) => {
    try {
        const timeTrack = _.pick(req.body, [
            'type',
            'customer',
            'project',
            'topic',
            'hours',
            'minutes',
        ]);

        if (timeTrack.project) {
            timeTrack.project = await Order.findById(timeTrack.project, {
                __v: 0,
            }).lean();
        }

        await TimeTrack.create(timeTrack);
        res.status(200).send();
    } catch (err) {
        res.status(503).send(err);
    }
};
