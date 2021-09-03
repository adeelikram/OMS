const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const ActiveUnit = require('../models/ActiveUnit');
const Tender = require('../models/Tender');

exports.getTenders = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;

    const { krav } = req.query;
    let query = {};

    if (krav)
        query = {
            $and: [
                { information: { $ne: undefined } },
                { information: { $ne: null } },
                { information: { $ne: '' } },
            ],
        };

    const tenders = await Tender.find(query);

    res.render('get_tenders', { tenders, krav, name: userProfile.displayName });
};

exports.getCreateTender = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render('get_create_tender', {
        editing: false,
        name: userProfile.displayName,
    });
};

exports.getEditTender = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const tender = await Tender.findById(req.params.id);
    res.render('get_create_tender', {
        tender,
        editing: true,
        name: userProfile.displayName,
    });
};

exports.postCreateTender = async (req, res, next) => {
    try {
        const tender = _.pick(req.body, [
            'customer',
            'description',
            'deadline',
            'date',
            'lastDate',
            'responsible',
            'information',
            'requirements',
        ]);
        await Tender.create(tender);
        res.status(200).send();
    } catch (err) {
        res.status(503).send(err);
    }
};

exports.postEditTender = async (req, res, next) => {
    try {
        const tender = _.pick(req.body, [
            'customer',
            'description',
            'deadline',
            'date',
            'lastDate',
            'responsible',
            'information',
            'requirements',
        ]);
        await Tender.findByIdAndUpdate(req.params.id, tender);
        res.status(200).send();
    } catch (err) {
        res.status(503).send(err);
    }
};

exports.getTenderRequirements = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    let tenders = [];

    if (req.params.id === 'all') {
        tenders = await Tender.find();
    } else {
        const tender = await Tender.findById(req.params.id);
        tenders.push(tender);
    }

    res.render('get_tender_requirements', {
        tenders,
        name: userProfile.displayName,
    });
};
