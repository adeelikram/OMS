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

    const productInActiveUnits =
        activeUnits[`${currentProduct.value}${unitType || ''}`];

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

    // console.log(
    //     'product:%s,deliveryId:%s,p:%s,unitType:%s',
    //     product,
    //     deliveryId,
    //     p,
    //     unitType
    // );

    // console.log(productValues, p, productValues.includes(p));

    if (!productValues.includes(p))
        return res.redirect(
            `/get-edit-place-of-delivery/${deliveryId}?edit=true`
        );

    const delivery = await DeliveryPlace.findById(deliveryId)
        .populate('orderId')
        .lean();

    // console.log('delivery', delivery);

    if (!delivery || !delivery.orderId)
        return res.redirect(
            `/get-edit-place-of-delivery/${deliveryId}?edit=true`
        );

    const currentProduct = products.find((e) => e.value === p);

    // console.log('currentProduct:%s', currentProduct);

    const activeUnits = await ActiveUnit.findOne({
        delivery: deliveryId,
        customer: delivery.orderId.customer,
    });

    console.log('activeUnits:%s', activeUnits);

    if (activeUnits) {
        // update the activeUnits
        // eslint-disable-next-line no-inner-declarations
        // function getUpdate() {
        //     let b = { [currentProduct.value]: req.body };
        //     if (unitType)
        //         b = {
        //             [currentProduct.value]: {
        //                 ...activeUnits[currentProduct.value],
        //                 [unitType]: req.body.enabled,
        //             },
        //         };
        //     return b;
        // }
        await ActiveUnit.updateOne(
            { delivery: deliveryId, customer: delivery.orderId.customer },
            { [`${currentProduct.value}${unitType || ''}`]: req.body }
        );
    } else {
        // create new
        const newActiveUnits = {
            customer: delivery.orderId.customer,
            delivery: deliveryId,
            [`${currentProduct.value}${unitType || ''}`]: req.body,
        };
        await ActiveUnit.create(newActiveUnits);
    }

    res.status(200).json();
};

const activeUnitLabels = [
    'roomMate',
    'nucleus',
    'neatseatmedium',
    'neatseatlarge',
    'sitShower',
    'otium',
];

const calculateActiveUnitsOfCustomer = (u) => {
    // Find count of all units from the array
    let units = 0;

    // Find count of active units from the array
    let activeUnits = 0;

    u.forEach((deliveryGroup) => {
        activeUnitLabels.forEach((label) => {
            units += deliveryGroup[label].length;
            activeUnits += deliveryGroup[label].filter(
                (e) => e.enabled === true
            ).length;
        });
    });

    // Calculate count of delivery places from length of activeUnits.length
    const deliveryPlaces = u.length;

    return { units, activeUnits, deliveryPlaces };
};

exports.getActiveUnits = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    try {
        // const activeUnits = await ActiveUnit.find().populate('delivery').lean();

        const activeUnitsByCustomer = await ActiveUnit.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: '$customer',
                    activeUnits: {
                        $push: {
                            roomMate: '$roomMate',
                            nucleus: '$nucleus',
                            neatseatmedium: '$neatseatmedium',
                            sitShower: '$sitShower',
                            otium: '$otium',
                            neatseatlarge: '$neatseatlarge',
                        },
                    },
                },
            },
        ]);

        const processedActiveUnits = [];

        activeUnitsByCustomer.forEach((customerGroup) => {
            const { units, activeUnits, deliveryPlaces } =
                calculateActiveUnitsOfCustomer(customerGroup.activeUnits);
            processedActiveUnits.push({
                customer: customerGroup._id,
                units,
                activeUnits,
                deliveryPlaces,
            });
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
        const [activeUnitsByDelivery, deliveryPlaces] = await Promise.all([
            ActiveUnit.aggregate([
                { $match: { customer } },
                {
                    $group: {
                        _id: '$delivery',
                        activeUnits: {
                            $push: {
                                roomMate: '$roomMate',
                                nucleus: '$nucleus',
                                neatseatmedium: '$neatseatmedium',
                                sitShower: '$sitShower',
                                otium: '$otium',
                                neatseatlarge: '$neatseatlarge',
                            },
                        },
                    },
                },
                {
                    $project: {
                        delivery: '$_id',
                        activeUnits: '$activeUnits',
                        _id: 0,
                    },
                },
            ]),
            DeliveryPlace.find().lean(),
        ]);

        activeUnitsByDelivery.forEach(
            (deliveryGroup) =>
                (deliveryGroup.delivery = deliveryPlaces.find(
                    (e) =>
                        e._id.toString() === deliveryGroup.delivery.toString()
                ))
        );

        activeUnitsByDelivery.forEach((e) => {
            [
                'roomMate',
                'nucleus',
                'neatseatmedium',
                'neatseatlarge',
                'sitShower',
                'otium',
            ].forEach((label) => {
                e.activeUnits.forEach((unit) => {
                    const allUnits = unit[label].length;
                    const activeUnits = unit[label].filter(
                        (u) => u.enabled === true
                    ).length;
                    const stats = { label, allUnits, activeUnits };
                    unit[label] = stats;

                    if (!activeUnits) delete unit[label];
                });
            });
        });

        res.render('get-active-units-info', {
            name: userProfile.displayName.delivery,
            customer,
            activeUnits: activeUnitsByDelivery,
        });
    } catch (error) {
        console.log(error);
    }
};
