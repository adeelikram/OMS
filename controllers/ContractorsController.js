const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const ActiveUnit = require('../models/ActiveUnit');
const Contractor = require('../models/Contractor');

exports.getContractors = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;

    const contractors = await Contractor.find();

    res.render('get_contractors', {
        contractors,
        name: userProfile.displayName,
    });
};

exports.getCreateContractor = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render('get_create_contractor', {
        editing: false,
        name: userProfile.displayName,
    });
};

exports.postCreateContractor = async (req, res, next) => {
    try {
        const contractor = _.pick(req.body, [
            'company',
            'contractor',
            'email',
            'phone',
            'customer',
            'rating',
            'comments',
            'neatseat',
        ]);

        await Contractor.create(contractor);
        res.status(200).send();
    } catch (err) {
        res.status(503).send(err);
    }
};
