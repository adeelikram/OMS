const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    portalId: {
      type: Number,
      default: 0
    },
    companyId: {
      type: Number,
      default: 0
    },
    owner: {
      type: String,
      default: 'N/A'
    },
    synced:{
      type: Boolean,
      default: false
    },
    isDeleted:{
      type: Boolean,
      default: false
    },
    properties: {
      type: Object,
      default: {}
    }
});
const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;