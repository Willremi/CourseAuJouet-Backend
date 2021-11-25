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
        required: true
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
        required: true
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
            required: true
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
    cart: []
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// Copie du json de la bdd user
// const userSchema = mongoose.Schema({
//     rememberMe:{ type: Boolean, required: false},
//     user: {
//         Civility: {type: String, required: true},
//         firsname: {type: String, required:true},
//         lastname: {type: String, required:true},
//         birthday_date: {type: Date, required:true},
//         phone: {type: Number, },
//         email: {type: String, required:true, unique:true},
//         password: {type: String, required: true},
//         registration_date: {type: Date, required: true},
//         account_statut: {type: Boolean, required: true}
//     },
//     role: {type: String, required: true},
//     address: [{
//         address_id: {type: ObjectId(), required: true},
//         country: {type: String},
//         number: {type: Number},
//         street: {type: Text},
//         address_supplement: {type: Text},
//         postal_code: {type: Number},
//         city: {type: String},
//         phone: {type: Number}
//     }],
//     order: [{
//         order_id: {type: ObjectId(), required: true},
//         order_date: {type: Date, required: true},
//         order_price: {type: Number, required: true},
//         product: [{
//             product_id: {type: ObjectId(), required: true},
//             quantity: {type: Number, required: true},
//             price: {type: Number, required: true},
//             total_price: {type: Number, required: true}
//         }],
//         order_status: {type: String, required: true}
//     }],
//     billing_address: [{
//         address_id: {type: ObjectId(), required: true},
//         country: {type: String},
//         number: {type: Number},
//         street: {type: Text},
//         address_supplement: {type: Text},
//         postal_code: {type: Number},
//         city: {type: String},
//         phone: {type: Number}
//     }],
//     cart: [{
//         product_id: {type: ObjectId(), required: true},
//         quantity: {type: Number, required: true},
//         price: {type: Number, required: true}
//     }],
//     reset_password: {type: String}
// })