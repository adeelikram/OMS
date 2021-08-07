const _ = require('lodash');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const DevTicket = require('../models/DevTicket');
const User = require('../models/User');
const { Order } = require('../models/Order');
const DeletedDeliveryPlace = require('../models/DeliveriesDeleted');

exports.getAddPlaceOfDelivery = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    const users = await User.find();
    const username = await User.findOne({ email: req.user.emails[0].value });
    let ticket$ = await DevTicket.findOne({ User: username._id });
    if (!ticket$) {
        ticket$ = { _id: 'dummy' };
    }
    // const editMode = req.query.edit;
    // if (!editMode) {
    //     return res.redirect("/");
    // }

    res.render('add-place-of-delivery', {
        name: userProfile.nickname,
        order,
        editing: false,
        users,
        userLength: users.length,
        user: username,
        user$: req.user,
        ticket: ticket$,
    });
};

exports.postAddPlaceOfDelivery = async (req, res, next) => {
    try {
        const { _raw, _json, ...userProfile } = req.user;

        const productKeys = [
            'roomMate',
            'roomMateRent',
            'roomMateSold',
            'nucleus',
            'neatseat',
            'sitShowerRent',
            'sitShowerSold',
            'otium',
        ];

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
            ...productKeys,
        ]);

        const order = await Order.findById(body.orderId).lean();

        const productsInBody = _.pick(body, productKeys);

        Object.keys(order).forEach((key) => {
            if (productKeys.includes(key)) {
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
            if (productKeys.includes(key)) {
                const p = body[key];
                if (p.units) p.units = { bought: p.units, left: p.units };
                else if (p.medium)
                    p.medium = { bought: p.medium, left: p.medium };
                else if (p.large) p.large = { bought: p.large, left: p.large };
            }
        });

        const accomplished = Object.entries(order).every(([key, value]) => {
            if (!productKeys.includes(key)) return true;
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

        const productKeys = [
            'roomMate',
            'roomMateRent',
            'roomMateSold',
            'nucleus',
            'neatseat',
            'sitShowerRent',
            'sitShowerSold',
            'otium',
        ];

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
            ...productKeys,
        ]);

        const order = await Order.findById(body.orderId).lean();

        const delivery = await DeliveryPlace.findById(body.deliveryId).lean();

        Object.keys(delivery).forEach((key) => {
            if (productKeys.includes(key)) {
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

        const productsInBody = _.pick(body, productKeys);

        Object.keys(order).forEach((key) => {
            if (productKeys.includes(key)) {
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
            if (productKeys.includes(key)) {
                const p = body[key];
                if (p.units) p.units = { bought: p.units, left: p.units };
                else if (p.medium)
                    p.medium = { bought: p.medium, left: p.medium };
                else if (p.large) p.large = { bought: p.large, left: p.large };
            }
        });

        const accomplished = Object.entries(order).every(([key, value]) => {
            if (!productKeys.includes(key)) return true;
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

exports.deleteDeliveryPlace = (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { deliveryPlaceId } = req.params;
    DeliveryPlace.findById(deliveryPlaceId)
        .then((delivery) => {
            if (!delivery) {
                return next(new Error('Order not found.'));
            }
            const deletedDeliveryPlace = new DeletedDeliveryPlace({
                orderId: delivery.orderId,
                placeOfDelivery: delivery.placeOfDelivery,
                customer: delivery.customer,
                orderDate: delivery.orderDate,
                adress: delivery.adress,
                zip: delivery.zip,
                deliveryDate: delivery.deliveryDate,
                deliveryContact: delivery.deliveryContact,
                deliveryContactPhone: delivery.deliveryContactPhone,
                deliveryContactEmail: delivery.deliveryContactEmail,
                deliveryContactATP: delivery.deliveryContactATP,
                deliveryContactATPhone: delivery.deliveryContactATPhone,
                deliveryContactATEmail: delivery.deliveryContactATEmail,
                deliveryCreation: delivery.deliveryCreation,
                deliveryDateDeadline: delivery.deliveryDateDeadline,
                sent: delivery.sent,
                utprovning: delivery.utprovning,
                installer: delivery.installer,
                otherInstaller: delivery.otherInstaller,
                electrician: delivery.electrician,
                //  otherElectrician: otherElectrician,
                roomMateRent: delivery.roomMateRent,
                roomMateRentWifiAntenna: delivery.roomMateRentWifiAntenna,
                roomMateRentWifi: delivery.roomMateRentWifi,
                roomMateRentRouterSim: delivery.roomMateRentRouterSim,
                roomMateRentNucleusStand: delivery.roomMateRentNucleusStand,
                roomMateRentForhojningL42: delivery.roomMateRentForhojningL42,
                roomMateRentForhojningM42: delivery.roomMateRentForhojningM42,
                roomMateRentForhojningL70: delivery.roomMateRentForhojningL70,
                roomMateRentForhojningM70: delivery.roomMateRentForhojningM70,
                roomMateRentArmRest: delivery.roomMateRentArmRest,
                roomMateRentRemote: delivery.roomMateRentRemote,
                roomMateRentShowerChair: delivery.roomMateRentShowerChair,
                roomMateSold: delivery.roomMateSold,
                roomMateSoldWifiAntenna: delivery.roomMateSoldWifiAntenna,
                roomMateSoldWifi: delivery.roomMateSoldWifi,
                roomMateSoldRouterSim: delivery.roomMateSoldRouterSim,
                roomMateSoldNucleusStand: delivery.roomMateSoldNucleusStand,
                roomMateSoldForhojningL42: delivery.roomMateSoldForhojningL42,
                roomMateSoldForhojningM42: delivery.roomMateSoldForhojningM42,
                roomMateSoldForhojningL70: delivery.roomMateSoldForhojningL70,
                roomMateSoldForhojningM70: delivery.roomMateSoldForhojningM70,
                roomMateSoldArmRest: delivery.roomMateSoldArmRest,
                roomMateSoldRemote: delivery.roomMateSoldRemote,
                roomMateSoldShowerChair: delivery.roomMateSoldShowerChair,
                nucleus: delivery.nucleus,
                nucleusWifiAntenna: delivery.nucleusWifiAntenna,
                nucleusWifi: delivery.nucleusWifi,
                nucleusRouterSim: delivery.nucleusRouterSim,
                nucleusNucleusStand: delivery.nucleusNucleusStand,
                nucleusForhojningL42: delivery.nucleusForhojningL42,
                nucleusForhojningM42: delivery.nucleusForhojningM42,
                nucleusForhojningL70: delivery.nucleusForhojningL70,
                nucleusForhojningM70: delivery.nucleusForhojningM70,
                nucleusArmRest: delivery.nucleusArmRest,
                nucleusRemote: delivery.nucleusRemote,
                nucleusShowerChair: delivery.nucleusShowerChair,
                sitShowerRent: delivery.sitShowerRent,
                sitShowerRentWifiAntenna: delivery.sitShowerRentWifiAntenna,
                sitShowerRentWifi: delivery.sitShowerRentWifi,
                sitShowerRentRouterSim: delivery.sitShowerRentRouterSim,
                sitShowerRentNucleusStand: delivery.sitShowerRentNucleusStand,
                sitShowerRentForhojningL42: delivery.sitShowerRentForhojningL42,
                sitShowerRentForhojningM42: delivery.sitShowerRentForhojningM42,
                sitShowerRentForhojningL70: delivery.sitShowerRentForhojningL70,
                sitShowerRentForhojningM70: delivery.sitShowerRentForhojningM70,
                sitShowerRentArmRest: delivery.sitShowerRentArmRest,
                sitShowerRentRemote: delivery.sitShowerRentRemote,
                sitShowerRentShowerChair: delivery.sitShowerRentShowerChair,
                sitShowerSold: delivery.sitShowerSold,
                sitShowerSoldWifiAntenna: delivery.sitShowerSoldWifiAntenna,
                sitShowerSoldWifi: delivery.sitShowerSoldWifi,
                sitShowerSoldRouterSim: delivery.sitShowerSoldRouterSim,
                sitShowerSoldNucleusStand: delivery.sitShowerSoldNucleusStand,
                sitShowerSoldForhojningL42: delivery.sitShowerSoldForhojningL42,
                sitShowerSoldForhojningM42: delivery.sitShowerSoldForhojningM42,
                sitShowerSoldForhojningL70: delivery.sitShowerSoldForhojningL70,
                sitShowerSoldForhojningM70: delivery.sitShowerSoldForhojningM70,
                sitShowerSoldArmRest: delivery.sitShowerSoldArmRest,
                sitShowerSoldRemote: delivery.sitShowerSoldRemote,
                sitShowerSoldShowerChair: delivery.sitShowerSoldShowerChair,
                neatSeatL: delivery.neatSeatL,
                neatseatLWifiAntenna: delivery.neatseatLWifiAntenna,
                neatseatLWifi: delivery.neatseatLWifi,
                neatseatLRouterSim: delivery.neatseatLRouterSim,
                neatseatLNucleusStand: delivery.neatseatLNucleusStand,
                neatseatLForhojningL42: delivery.neatseatLForhojningL42,
                neatseatLForhojningM42: delivery.neatseatLForhojningM42,
                neatseatLForhojningL70: delivery.neatseatLForhojningL70,
                neatseatLForhojningM70: delivery.neatseatLForhojningM70,
                neatseatLArmRest: delivery.neatseatLArmRest,
                neatseatLRemote: delivery.neatseatLRemote,
                neatseatLShowerChair: delivery.neatseatLShowerChair,
                neatSeatM: delivery.neatSeatM,
                neatseatMWifiAntenna: delivery.neatseatMWifiAntenna,
                neatseatMWifi: delivery.neatseatMWifi,
                neatseatMRouterSim: delivery.neatseatMRouterSim,
                neatseatMNucleusStand: delivery.neatseatMNucleusStand,
                neatseatMForhojningL42: delivery.neatseatMForhojningL42,
                neatseatMForhojningM42: delivery.neatseatMForhojningM42,
                neatseatMForhojningL70: delivery.neatseatMForhojningL70,
                neatseatMForhojningM70: delivery.neatseatMForhojningM70,
                neatseatMArmRest: delivery.neatseatMArmRest,
                neatseatMRemote: delivery.neatseatMRemote,
                neatseatMShowerChair: delivery.neatseatMShowerChair,
                educationRoomMate: delivery.educationRoomMate,
                educationNucleus: delivery.educationNucleus,
                educationSitandShower: delivery.educationSitandShower,
                educationNeatseat: delivery.educationNeatseat,
            });
            deletedDeliveryPlace
                .save()
                .then((result) => {
                    console.log('UPDATED Deleted Delivery Place!');
                    res.redirect('/ongoing-projects');
                })
                .catch((err) => console.log(err));
            return DeliveryPlace.deleteOne({ _id: deliveryPlaceId });
        })
        .then(() => {
            res.redirect('/ongoing-projects');
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Deleting delivery place failed.',
            });
        });
};
