const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    tenant: String,
    connection: String,
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    debug: Boolean,
    email_verified: Boolean,
    resetToken: String,
    resetTokenExpiration: Date,
    date: {
        type: Date,
        default: Date.now(),
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
