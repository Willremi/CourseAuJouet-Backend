const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    civility: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday_date: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    registration_date: {
        type: Date,
        required: true
    },
    account_status: {
        type: Boolean,
        required: true
    },
    rememberMe: {
        type: Boolean,
        required: false
    },
    role: [{
        role_name: {
            type: String,
            required: false
        }
    }],
    confirmationCode: {
        type: String,
        unique: true
    },
    reset_password: {
        type: String,
        unique: true
    },
    googleId: {
        type: String,
        required: false,
        unique: true
    },
    facebookId: {
        type: String,
        required: false,
        unique: true
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

