const mongoose = require('mongoose');

const AbsentSchema = new mongoose.Schema({
    type: {
        type: String,
       default: ""
    },
    from: {
      type: Date,
    },
    to: {
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

const Absent = mongoose.model('Absent', AbsentSchema);
module.exports = Absent;