const dateformat = require('dateformat');
const mongoose = require('mongoose');
const _ = require('lodash');
const { Order } = require('../models/Order');
const { ArchivedOrder } = require('../models/Order');
const User = require('../models/User');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const { ArchivedDelivery } = require('../models/DeliveryPlaces');
const Shipment = require('../models/Shipment');
const OrderDeleted = require('../models/OrderDeleted');
const DeletedDeliveryPlace = require('../models/DeliveriesDeleted');
const Customer = require('../models/Hubspot/customer');



module.exports.getOrders = (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    Order.find({})
        .then((orders) => {
            const ordersLength = orders.length;
            res.render('orders', {
                orders,
                ordersCount: ordersLength,
                name: userProfile.nickname,
            });
        })
        .catch((err) => console.log(err));
};

exports.getAddOrder = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const orders = await Order.find({});
    const ordersCount = orders.length;
    let customers = await Customer.find({});
    customers = customers.map(i => i.properties.name.value);

    res.render('add-order', {
        disabled: false,
        editing: false,
        name: userProfile.nickname,
        ordersCount,
        customers
    });
};

exports.postAddOrder = async (req, res) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;

        const body = _.pick(req.body, [
            'clientName',
            'customer',
            'email',
            'invoiceInfo',
            'invoiceNumber',
            'isInvoiceGenerated',
            'houseAdaptation',
            'neatseat',
            'nucleus',
            'number',
            'orderDate',
            'orderDeadline',
            'otium',
            'roomMate',
            'sitShower',
            'manager',
        ]);

        body.number = body.number || 1;

        if (!body.manager) body.manager = name;

        const order = await Order.findOne({ customer: body.customer });
        if (order) body.number = parseInt(body.number) + 1;

        if (body.orderDeadline)
            body.orderDeadline = new Date(body.orderDeadline);

        if (body.orderDate) body.orderDate = new Date(body.orderDate);
        else body.orderDate = new Date();

        const products = _.pick(body, [
            'roomMate',
            'nucleus',
            'neatseat',
            'sitShower',
            'otium',
        ]);

        Object.entries(products).forEach((product) => {
            const [key, value] = product;

            if (key === 'neatseat') {
                if (products[key].medium)
                    products[key].medium = {
                        bought: products[key].medium,
                        left: products[key].medium,
                    };
                if (products[key].large)
                    products[key].large = {
                        bought: products[key].large,
                        left: products[key].large,
                    };
            } else if (products[key].units)
                products[key].units = {
                    bought: products[key].units,
                    left: products[key].units,
                };

            const { accessories } = products[key];

            if (accessories) {
                Object.entries(accessories).forEach(
                    ([k, v]) =>
                    (accessories[k] = {
                        bought: accessories[k],
                        left: accessories[k],
                    })
                );
            }
        });

        
        await Order.create(body);

        
        
        req.flash('success_msg', 'Order added successfully...');
        res.end()
    } catch (error) {
        console.log(error);
        if(error) res.json({message:"Error occured in backend please check OrderController.js postAddOrder function"});
    }
};

exports.getEditOrder = async (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) return res.redirect('/');

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    let customers = await Customer.find({});
    customers = customers.map(i => i.properties.name.value);
    res.render('add-order', {
        disabled: false,
        editing: editMode,
        order,
        name: req.user.nickname,
        customers
    });
};

exports.postEditOrder = async (req, res, next) => {
    try {
        const { _raw, _json, nickname: name, ...userProfile } = req.user;

        const body = _.pick(req.body, [
            'id',
            'clientName',
            'customer',
            'email',
            'invoiceInfo',
            'invoiceNumber',
            'isInvoiceGenerated',
            'neatseat',
            'nucleus',
            'orderDate',
            'orderDeadline',
            'otium',
            'roomMate',
            'sitShower',
            'manager',
            'assistant',
            'planningMeeting',
            'internalConsultation',
            'orderedUnits',
            'internetConnection',
            'meshSystem',
        ]);

        if (!body.meshSystem) {
            if (body.orderDeadline)
                body.orderDeadline = new Date(body.orderDeadline);

            if (body.orderDate) body.orderDate = new Date(body.orderDate);
        }

        const newOrder = _.pick(body, [
            'clientName',
            'customer',
            'email',
            'invoiceInfo',
            'invoiceNumber',
            'isInvoiceGenerated',
            'neatseat',
            'nucleus',
            'otium',
            'roomMate',
            'roomMateRent',
            'roomMateSold',
            'sitShowerRent',
            'sitShowerSold',
            'orderDate',
            'orderDeadline',
            'manager',
            'assistant',
            'planningMeeting',
            'internalConsultation',
            'orderedUnits',
            'internetConnection',
            'meshSystem',
        ]);

        const products = _.pick(body, [
            'roomMate',
            'nucleus',
            'neatseat',
            'sitShower',
            'otium',
        ]);

        Object.entries(products).forEach((product) => {
            const [key, value] = product;
            if (products[key].units)
                products[key].units = {
                    bought: products[key].units,
                    left: products[key].units,
                };

            const { accessories } = products[key];

            if (accessories) {
                Object.entries(accessories).forEach(
                    ([k, v]) =>
                    (accessories[k] = {
                        bought: accessories[k],
                        left: accessories[k],
                    })
                );
            }
        });

        await Order.updateOne({ _id: body.id }, newOrder);
        req.flash('success_msg', 'Order added successfully...');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

exports.deleteOrder = (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { orderId } = req.params;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error('Order not found.'));
            }
            const orderDeleted = new OrderDeleted({
                // destructuring
                customer: order.customer,
                customerOrderNumber: order.customerOrderNumber,
                clientName: order.clientName,
                number: order.number,
                email: order.email,
                orderDeadline: order.orderDeadline,
                //  orderDate: orderDate,
                roomMateRent: order.roomMateRent,
                roomMateSold: order.roomMateSold,
                roomMatePeriodRent: order.roomMatePeriodRent,
                roomMatePeriodSold: order.roomMatePeriodSold,
                roomMateInstallationRent: order.roomMateInstallationRent,
                roomMateInstallationSold: order.roomMateInstallationSold, // RoomMate
                nucleus: order.nucleus,
                nucleusGammal: order.nucleusGammal,
                rentalPeriodNucleus: order.rentalPeriodNucleus, // Nucleus
                neatseatL: order.neatseatL,
                nestseatM: order.nestseatM,
                neatseatInstallation: order.neatseatInstallation, // Neatseat
                sitandshowerSold: order.sitandshowerSold,
                sitandshowerRent: order.sitandshowerRent,
                sitandshowerPeriodRent: order.sitandshowerPeriodRent,
                // sitandshowerPeriodSold: order.sitandshowerPeriodSold,
                sitandshowerInstallationRent:
                    order.sitandshowerInstallationRent,
                sitandshowerInstallationSold:
                    order.sitandshowerInstallationSold,
                // rentalPeroodSitandshower,
                wifiAntenna: order.wifiAntenna,
                wifi: order.wifi,
                routerSim: order.routerSim,
                nucleusStand: order.nucleusStand,
                forhojningL42: order.forhojningL42,
                forhojningM42: order.forhojningM42,
                forhojningL70: order.forhojningL70,
                forhojningM70: order.forhojningM70,
                armRest: order.armRest,
                remote: order.remote,
                showerChair: order.showerChair,
                addedBy: order.addedBy,
            });
            orderDeleted
                .save()
                .then((result) => {
                    res.redirect('/ongoing-projects');
                })
                .catch((err) => console.log(err));
            return Order.deleteOne({ _id: orderId });
        })
        .then(() => {
            console.log('DELETED ORDER');
            res.redirect('/orders');
        })
        .catch((err) => {
            res.status(500).json({ message: 'Deleting order failed.' });
        });
};

exports.getOrderStatus = async (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    res.render('order-status', {
        name: userProfile.nickname,
        order,
        editing: editMode,
    });
};

exports.postEditOrderStatus = (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { orderId, accomplished, status, orderDate, orderDeadline } =
        req.body;
    const name = userProfile.nickname;
    Order.findById(orderId)
        .then((order) => {
            // order.addedBy.push(name);
            // order.customer = customer;
            // order.customerOrderNumber = customerOrderNumber;
            order.accomplished = accomplished;
            order.status = status;
            order.orderDate = orderDate;
            order.orderDate = orderDeadline;
            return order.save().then((result) => {
                console.log('UPDATED order!');
                res.redirect('/orders');
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.archiveOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        const swap = new (mongoose.model('ArchivedOrder'))(order.toJSON()); // or result.toObject
        /* you could set a new id
        swap._id = mongoose.Types.ObjectId()
        swap.isNew = true
        */
        const deliveryPlace = await DeliveryPlace.find({ orderId });
        for (let i = 0; i < deliveryPlace.length; i++) {
            const dPlace = deliveryPlace[i];
            const deliveryPlaceSwap = new (mongoose.model('ArchivedDelivery'))(
                dPlace.toJSON()
            );
            await dPlace.remove();
            await deliveryPlaceSwap.save();
        }
        await order.remove();
        await swap.save();
        res.redirect('/archived-orders');
    } catch (error) {
        console.log(error.message);
    }
};

exports.getArchivedOrders = async (req, res) => {
    try {
        const { _raw, _json, ...userProfile } = req.user;
        const orders = await ArchivedOrder.find({});
        const deliveries = await ArchivedDelivery.find({});
        const ordersLength = orders.length;
        res.render('archived-orders', {
            orders,
            deliveries,
            ordersCount: ordersLength,
            name: userProfile.nickname,
        });
    } catch (error) {
        console.log(error.message);
    }
};

exports.restoreOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await ArchivedOrder.findById(orderId);
        const swap = new (mongoose.model('Order'))(order.toJSON()); // or result.toObject
        /* you could set a new id
        swap._id = mongoose.Types.ObjectId()
        swap.isNew = true
        */
        const archivedDeliveryPlace = await ArchivedDelivery.find({
            orderId,
        });
        for (let i = 0; i < archivedDeliveryPlace.length; i++) {
            const archivedDPlace = archivedDeliveryPlace[i];
            const archivedDeliveryPlaceSwap = new (mongoose.model('Delivery'))(
                archivedDPlace.toJSON()
            );
            await archivedDPlace.remove();
            await archivedDeliveryPlaceSwap.save();
        }

        await order.remove();
        await swap.save();
        res.redirect('/orders');
    } catch (error) {
        console.log(error.message);
    }
};

exports.getViewArchivedOrder = (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    let roomMateInstallationRent = false;
    let roomMateInstallationSold = false;
    let sitandshowerInstallationRent = false;
    let sitandshowerInstallationSold = false;
    let neatseatInstallation = false;
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/');
    }
    const { orderId } = req.params;
    ArchivedOrder.findById(orderId)
        .then((order) => {
            console.log('Edit order route', order);
            if (order.roomMateInstallationRent > 0) {
                roomMateInstallationRent = true;
            }
            if (order.roomMateInstallationSold > 0) {
                roomMateInstallationSold = true;
            }
            if (order.sitandshowerInstallationRent > 0) {
                sitandshowerInstallationRent = true;
            }
            if (order.sitandshowerInstallationSold > 0) {
                sitandshowerInstallationSold = true;
            }
            if (order.neatseatInstallation > 0) {
                neatseatInstallation = true;
            }
            let boolPeriod = true;
            if (!order) {
                return res.redirect('/');
            }
            if (order.roomMateSold[0] == 0) {
                boolPeriod = false;
            }
            if (order.roomMateRent[0] == 0) {
                boolPeriod = false;
            }
            res.render('add-order', {
                name: userProfile.nickname,
                pageTitle: 'View Order',
                path: 'add-order',
                editing: editMode,
                roomMateInstallationRent,
                roomMateInstallationSold,
                sitandshowerInstallationRent,
                sitandshowerInstallationSold,
                neatseatInstallation,
                order,
                boolPeriod,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
                disabled: true,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
