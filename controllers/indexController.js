const dateformat = require('dateformat');
const mongoose = require('mongoose');
const { Order } = require('../models/Order');
const { ArchivedOrder } = require('../models/Order');
const User = require('../models/User');
const DeliveryPlace = require('../models/DeliveryPlaces').Delivery;
const { ArchivedDelivery } = require('../models/DeliveryPlaces');
const Shipment = require('../models/Shipment');
const OrderDeleted = require('../models/OrderDeleted');
const DeletedDeliveryPlace = require('../models/DeliveriesDeleted');
// const popup = require('node-popup');

exports.postOrderManagement = (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    // const orderId = req.params.orderId;
    const {
        orderId,
        changeManagement,
        cManagementChoice,
        projectManager,
        eventBooked,
        sendInstructions,
        sInstructionsChoice,
    } = req.body;
    console.log('cManagementChoice: ', cManagementChoice);
    Order.findById(orderId)
        .then((order) => {
            const arr = [];
            const arrB = [];
            if (cManagementChoice == 'Yes') {
                arr.push(changeManagement, cManagementChoice, Date.now());
            } else {
                arr.push(changeManagement, cManagementChoice);
            }
            if (sInstructionsChoice == 'Yes') {
                arrB.push(sendInstructions, sInstructionsChoice, Date.now());
            } else {
                arrB.push(sendInstructions, sInstructionsChoice);
            }
            console.log("hello "+order)    
            order.changeManagement.push(arr);
            // order.changeManagement.push(cManagementChoice);
            order.sendInstructions.push(arrB);
            order.projectManager = projectManager;
            order.eventBooked = eventBooked;
            return order.save().then((result) => {
                console.log('UPDATED order!');
                res.redirect('/ongoing-projects');
            });
        })
        .catch((err) => console.log(err));
};

exports.getSendPage = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { deliveryId } = req.params;
    const delivery = await DeliveryPlace.findById(deliveryId);
    res.render('send_page', {
        name: userProfile.nickname,
        order: delivery,
    });
};

exports.postShipment = async (req, res) => {
    const { _raw, _json, ...userProfile } = req.user;
    const { deliveryId } = req.params;
    // DeliveryPlace.findById(deliveryId).then(delivery => {
    const delivery = await DeliveryPlace.findById(deliveryId);
    const newShipment = new Shipment({
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
    newShipment
        .save()
        .then((shipment) => {
            req.flash('success_msg', 'Shipment added successfully...');
            res.redirect('/ongoing-projects');
        })
        .catch((err) => console.log(err));
};
