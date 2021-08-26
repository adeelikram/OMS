const mongoose = require('mongoose');

const MilageSchema = new mongoose.Schema({
  kilometer: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
  },
  approved: {
    type: Boolean,
    default: false
  },
    employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
});

const Milage = mongoose.model('Milage', MilageSchema);
module.exports = Milage;