const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const ActiveUnit = require('../models/ActiveUnit');
const Tender = require('../models/Tender');

const getProduct = (value, label) => ({ label, value });

const products = [
    getProduct('roomMate', 'RoomMate'),
    getProduct('nucleus', 'Nucleus'),
    getProduct('neatseat', 'Neatseat'),
    getProduct('sitShower', 'Sit&Shower'),
    getProduct('otium', 'Otium'),
];

const productLabels = products.map((p) => p.label);
const productValues = products.map((p) => p.value);

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
    res.render('get_create_tender', { name: userProfile.displayName });
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
        ]);
        await Tender.create(tender);
        res.status(200).send();
    } catch (err) {
        res.status(503).send(err);
    }
};

exports.postCreateTenderDescription = async (req, res, next) => {
    try {
        console.log(req.body.information, typeof req.body.information);
        await Tender.findByIdAndUpdate(req.params.id, {
            information: req.body.information,
        });
        res.redirect('/tenders');
    } catch (err) {
        res.status(503).send(err);
    }
};

exports.postConfigureActiveUnits = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { product, deliveryId } = req.params;

    let p = product;
    let unitType = null;

    if (p.includes('neatseat')) {
        const [key, type] = p.split('-');
        unitType = type;
        p = key;
    }

    if (!productValues.includes(p))
        return res.redirect(
            `/get-edit-place-of-delivery/${deliveryId}?edit=true`
        );

    const delivery = await DeliveryPlace.findById(deliveryId)
        .populate('orderId')
        .lean();

    if (!delivery || !delivery.orderId)
        return res.redirect(
            `/get-edit-place-of-delivery/${deliveryId}?edit=true`
        );

    const currentProduct = products.find((e) => e.value === p);

    const activeUnits = await ActiveUnit.findOne({
        delivery: deliveryId,
        customer: delivery.orderId.customer,
    });

    if (activeUnits) {
        // update the activeUnits
        // eslint-disable-next-line no-inner-declarations
        function getUpdate() {
            let b = { [currentProduct.value]: req.body };
            if (unitType)
                b = {
                    [currentProduct.value]: {
                        ...activeUnits[currentProduct.value],
                        [unitType]: req.body.enabled,
                    },
                };
            return b;
        }
        await ActiveUnit.updateOne(
            { delivery: deliveryId, customer: delivery.orderId.customer },
            getUpdate()
        );
    } else {
        // create new
        const newUnit = {
            customer: delivery.orderId.customer,
            delivery: deliveryId,
            [currentProduct.value]: req.body,
        };
        if (unitType)
            newUnit[currentProduct.value] = {
                [unitType]: req.body.enabled,
            };
        await ActiveUnit.create(newUnit);
    }

    res.status(200).json();
};

exports.getActiveUnits = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    try {
        const activeUnits = await ActiveUnit.find().populate('delivery').lean();

        const processedActiveUnits = [];

        // each distint customer will have all the units in all products in all deliveries summed up

        activeUnits.forEach((unit) => {
            // same customer exists
            const indexOfExistingCustomer = processedActiveUnits.indexOf(
                (e) => e.customer === unit.customer
            );
            if (indexOfExistingCustomer !== -1) {
                const currUnit = processedActiveUnits[indexOfExistingCustomer];

                currUnit.deliveryPlaces++;

                [
                    'roomMate',
                    'nucleus',
                    'neatseat',
                    'sitShower',
                    'otium',
                ].forEach((productGroup) => {
                    currUnit[productGroup].forEach((p, index) => {
                        if (p.medium) currUnit.units += 1;
                        if (p.large) currUnit.units += 1;
                        if (p.units) currUnit.units += 1;
                    });
                });
            } else {
                let units = 0;
                [
                    'roomMate',
                    'nucleus',
                    'neatseat',
                    'sitShower',
                    'otium',
                ].forEach((productGroup) => {
                    unit[productGroup].forEach((p) => {
                        console.log(p);
                        if (p.medium) units += 1;
                        if (p.large) units += 1;
                        if (p.enabled) units += 1;
                    });
                });

                processedActiveUnits.push({
                    customer: unit.customer,
                    units,
                    deliveryPlaces: 1,
                });
            }
        });

        res.render('active-units', {
            name: userProfile.displayName.delivery,
            activeUnits: processedActiveUnits,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getActiveUnitsByCustomer = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { customer } = req.params;
    try {
        const activeUnits = await ActiveUnit.find({ customer })
            .populate('delivery')
            .lean();

        const processedActiveUnits = [];

        // each distint customer will have all the units in all products in all deliveries summed up

        activeUnits.forEach((unit) => {
            // same customer exists
            productValues.forEach((productGroup) => {
                let units = 0;
                unit[productGroup].forEach((p) => {
                    if (p.medium) {
                        // console.log(unit.delivery);
                        units += unit.delivery[productGroup].medium.bought;
                    }

                    if (p.large) {
                        // console.log(unit.delivery);
                        units += unit.delivery[productGroup].large.bought;
                    }

                    if (p.enabled) {
                        // console.log(unit.delivery);
                        units += unit.delivery[productGroup].units.bought;
                    }
                });
                if (units)
                    processedActiveUnits.push({
                        customer: unit.customer,
                        units,
                        product: products.find((e) => e.value === productGroup),
                        deliveryPlace: unit.delivery.title,
                        deliveryId: unit.delivery._id,
                    });
            });
        });

        res.render('get-active-units-info', {
            name: userProfile.displayName.delivery,
            activeUnits: processedActiveUnits,
        });
    } catch (error) {
        console.log(error);
    }
};
