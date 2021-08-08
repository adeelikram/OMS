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
        }).lean()) || {};

    const currentProduct = products.find((e) => e.value === p);

    const productInActiveUnits = activeUnits[currentProduct.value];

    const response = {
        name: userProfile.nickname,
        product: {
            ...currentProduct,
            ...delivery.orderId[currentProduct.value],
        },
        activeUnits,
        editing: false,
        delivery,
    };

    if (['nucleus', 'sitShower', 'neatseat'].includes(p))
        response.activeUnits = {
            ...response.activeUnits,
            invoiceNumber: delivery.orderId.invoiceNumber,
        };

    if (unitType) response.type = unitType;

    if (productInActiveUnits) {
        response.activeUnits = {
            ...response.activeUnits,
            productInActiveUnits,
        };
        response.editing = true;
    }

    res.render('configure-active-units', response);
};

exports.postAddPlaceOfDelivery = async (req, res, next) => {
    try {
        const { _raw, _json, ...userProfile } = req.user;

        const body = _.pick(req.body, [
            'orderId',
            'title',
            'address',
            'zip',
            'customer',
            'contact',
            'email',
            'occupationalTherapist',
            'contactTherapist',
            'emailTherapist',
            'date',
            'deadline',
            'sent',
            'testing',
            'installer',
            'otherInstaller',
            'plumbingFitter',
            'electrician',
            'education',
            ...productValues,
        ]);

        const order = await Order.findById(body.orderId).lean();

        const productsInBody = _.pick(body, productValues);

        Object.keys(order).forEach((key) => {
            if (productValues.includes(key)) {
                const productInBody = productsInBody[key];
                if (productInBody) {
                    const o = order[key];
                    if (o.medium || o.large) {
                        if (productInBody.medium)
                            o.medium.left -= productInBody.medium;
                        else o.large.left -= productInBody.large;
                    } else if (o.units) {
                        o.units.left -= productInBody.units;
                        o.installation = productInBody.installation;
                    }
                }
            }
        });

        Object.keys(body).forEach((key) => {
            if (productValues.includes(key)) {
                const p = body[key];
                if (p.units) p.units = { bought: p.units, left: p.units };
                else if (p.medium)
                    p.medium = { bought: p.medium, left: p.medium };
                else if (p.large) p.large = { bought: p.large, left: p.large };
            }
        });

        const accomplished = Object.entries(order).every(([key, value]) => {
            if (!productValues.includes(key)) return true;
            if (value.large && value.medium)
                return value.large.left <= 0 && value.mediuum.left <= 0;
            if (value.large) return value.large.left <= 0;
            if (value.medium) return value.medium.left <= 0;
            if (value.units) return value.units.left <= 0;
            return true;
        });

        order.accomplished = accomplished;

        await Order.findByIdAndUpdate(body.orderId, order);

        await DeliveryPlace.create(body);

        res.status(200).send();
    } catch (error) {
        console.log(error);
    }
};

exports.getEditPlaceOfDelivery = async (req, res) => {
    try {
        const { _raw, _json, ...userProfile } = req.user;
        const users = await User.find();
        const editMode = req.query.edit;

        if (!editMode) return res.redirect('/');

        const { deliveryId } = req.params;
        const delivery = await await DeliveryPlace.findById(
            deliveryId
        ).populate('orderId');
        const order = await Order.findById(delivery.orderId._id);

        if (!delivery) return res.redirect('/');

        const username = await User.findOne({
            email: req.user.emails[0].value,
        });
        let ticket$ = await DevTicket.findOne({ User: username._id });
        if (!ticket$) {
            ticket$ = { _id: 'dummy' };
        }

        res.render('add-place-of-delivery', {
            name: userProfile.nickname,
            order,
            editing: true,
            users,
            userLength: users.length,
            delivery,
            user: username,
            ticket: ticket$,
            user$: req.user,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postEditPlaceOfDelivery = async (req, res, next) => {
    try {
        const { _raw, _json, ...userProfile } = req.user;

        const body = _.pick(req.body, [
            'orderId',
            'title',
            'address',
            'zip',
            'customer',
            'contact',
            'email',
            'occupationalTherapist',
            'contactTherapist',
            'emailTherapist',
            'date',
            'deadline',
            'sent',
            'deliveryId',
            'testing',
            'installer',
            'otherInstaller',
            'plumbingFitter',
            'electrician',
            'education',
            'designVisit',
            'installation',
            ...productValues,
        ]);

        const order = await Order.findById(body.orderId).lean();

        const delivery = await DeliveryPlace.findById(body.deliveryId).lean();

        Object.keys(delivery).forEach((key) => {
            if (productValues.includes(key)) {
                const o = order[key];
                const d = delivery[key];
                if (o) {
                    if (o.medium) o.medium.left += d.medium.left;
                    else if (o.large) o.large.left += d.large.left;
                    else if (o.units) {
                        o.units.left += d.units.left;
                        o.installation = undefined;
                    }
                }
            }
        });

        const productsInBody = _.pick(body, productValues);

        Object.keys(order).forEach((key) => {
            if (productValues.includes(key)) {
                const productInBody = productsInBody[key];
                if (productInBody) {
                    const o = order[key];
                    if (o.medium || o.large) {
                        if (productInBody.medium)
                            o.medium.left -= productInBody.medium;
                        else o.large.left -= productInBody.large;
                    } else if (o.units) {
                        o.units.left -= productInBody.units;
                        o.installation = productInBody.installation;
                    }
                }
            }
        });

        Object.keys(body).forEach((key) => {
            if (productValues.includes(key)) {
                const p = body[key];
                if (p.units) p.units = { bought: p.units, left: p.units };
                else if (p.medium)
                    p.medium = { bought: p.medium, left: p.medium };
                else if (p.large) p.large = { bought: p.large, left: p.large };
            }
        });

        const accomplished = Object.entries(order).every(([key, value]) => {
            if (!productValues.includes(key)) return true;
            if (value.large && value.medium)
                return value.large.left <= 0 && value.mediuum.left <= 0;
            if (value.large) return value.large.left <= 0;
            if (value.medium) return value.medium.left <= 0;
            if (value.units) return value.units.left <= 0;
            return true;
        });

        order.accomplished = accomplished;

        await Order.findByIdAndUpdate(body.orderId, order);

        await DeliveryPlace.findByIdAndUpdate(body.deliveryId, body);

        res.status(200).send();
    } catch (error) {
        console.log('Edit delivery error', error);
    }
};
