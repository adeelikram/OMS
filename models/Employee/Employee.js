const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    username: {
        type: String,
       default: ""
    },
    name: {
        type: String,
       default: ""
    },
    address: {
        type: String,
       default: ""
    },
    postNumber: {
        type: String,
       default: ""
    },
    postAddress: {
      type: String,
     default: ""
    },
    phoneNumber: {
      type: String,
     default: ""
    },
    accountNumber: {
        type: String,
       default: ""
    },
    bank: {
        type: String,
       default: ""
    },
    clearing: {
        type: String,
       default: ""
    },
    jobType: {
      type: String,
     default: ""
    },
    vaccations: {
      type: Number,
     default: 0
    },
});
const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;