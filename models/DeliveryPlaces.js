const mongoose = require('mongoose');
const RoomMate = require('./Order/RoomMate');
const Nucleus = require('./Order/Nucleus');
const Neatseat = require('./Order/Neatseat');
const SitShower = require('./Order/SitShower');
const Otium = require('./Order/Otium');

const productKeys = ['roomMate', 'nucleus', 'sitShower', 'neatseat'];

const getBasicSchema = () => ({
    name: String,
    contact: String,
    email: String,
    date: Date,
});

const getEducationAdminSchema = () => ({
    user: String,
    date: Date,
    finished: Boolean,
    type: { type: String },
});

const getEducationSchema = () => {
    const schema = {};
    productKeys.forEach((p) => {
        schema[p] = {
            user: String,
            contact: String,
            date: Date,
            finished: Boolean,
            type: { type: String },
        };
        if (p === 'roomMate' || p === 'nucleus' || p === 'otium')
            p.admin = getEducationAdminSchema();
    });
    return schema;
};

const DeliveryPlaceSchema = new mongoose.Schema({
    orderId: { type: mongoose.Types.ObjectId, ref: 'Order' },
    title: String,
    customer: String,
    date: Date,
    deadline: Date,
    sent: Boolean,
    address: String,
    zip: String,
    contact: String,
    email: String,
    occupationalTherapist: String,
    contactTherapist: String,
    emailTherapist: String,
    designVisit: {
        internetAccessWorks: { type: Boolean, default: false },
        examineAllRooms: {
            examined: { type: Boolean, default: false },
            comments: String,
        },
        completed: {
            completed: { type: Boolean, default: false },
            comments: String,
        },
        phoneWorks: {
            works: { type: Boolean, default: false },
            comments: String,
        },
    },
    installation: {
        responsible: String,
    },
    testing: {
        user: String,
        finished: Boolean,
    },
    installer: String,
    otherInstaller: { ...getBasicSchema(), company: String },
    plumbingFitter: {
        ...getBasicSchema(),
        nucleus: Boolean,
        company: String,
    },
    electrician: { ...getBasicSchema(), company: String },
    education: getEducationSchema(),
    roomMate: RoomMate,
    nucleus: Nucleus,
    neatseat: Neatseat,
    sitShower: SitShower,
    otium: Otium,
});
const Delivery = mongoose.model('Delivery', DeliveryPlaceSchema);
const ArchivedDelivery = mongoose.model(
    'ArchivedDelivery',
    DeliveryPlaceSchema
);

module.exports = { Delivery, ArchivedDelivery };
