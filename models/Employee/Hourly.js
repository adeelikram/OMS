const mongoose = require('mongoose');

const HourlySchema = new mongoose.Schema({
  hours: {
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

const Hourly = mongoose.model('Hourly', HourlySchema);
module.exports = Hourly;