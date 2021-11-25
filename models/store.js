const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const storeSchema = mongoose.Schema({

    siret_number: {
        type: String,
        required: true
    },
    product: [{
        product_name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        trademark: {
            type: String,
            required: true
        },
        required_age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number
        },
        size: {
            type: Number
        },
        on_sale_date: {
            type: Date,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    }],
    orders: [{
        pending_order: [{
            order_id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            user_id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            user_address: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            billing_adress: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            status: {
                type: String,
                required: true
            }
        }],
        order_shipped: [{
            order_id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            user_id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            user_address: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            billing_adress: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            status: {
                type: String,
                required: true
            }
        }]
    }],
    address: [{
        country: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        address_supplement: {
            type: String,
            required: true
        },
        postal_code: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
    }]

})

storeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Store', storeSchema);