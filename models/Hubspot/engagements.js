const mongoose = require('mongoose');

const EngagementsSchema = new mongoose.Schema({
    calls: {
      type: Array,
      default: []
    },
    emails: {
      type: Array,
      default: []
    },
    meetings: {
      type: Array,
      default: []
    },
    username: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});

const Engagements = mongoose.model('Engagements', EngagementsSchema);

module.exports = Engagements;