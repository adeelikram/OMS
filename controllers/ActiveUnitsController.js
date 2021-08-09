const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const ActiveUnit = require('../models/ActiveUnit');

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

exports.getConfigureActiveUnits = async (req, res, next) => {
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

    const activeUnits =
        (await ActiveUnit.findOne({
            delivery: delivery._id,
            customer: delivery.orderId.customer,
        }).lean()) || {};

    const currentProduct = products.find((e) => e.value === p);

    const productInActiveUnits = activeUnits[currentProduct.value];

    const response = {
        name: userProfile.nickname,
        product: {
            ...currentProduct,
            ...delivery[currentProduct.value],
        },
        activeUnits,
        editing: false,
        delivery,
    };

    if (unitType) response.unit = unitType;

    if (productInActiveUnits) {
        response.activeUnits = productInActiveUnits;
        response.editing = true;
    }
    // response.activeUnits = {
    //     ...response.activeUnits,
    //     invoiceNumber: delivery.orderId.invoiceNumber,
    // };

    res.render('configure-active-units', response);
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
