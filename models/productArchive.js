const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productArchiveSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
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
    quantity: {
        type: Number,
        default: 1
    },
    trademark: {
        type: String,
        required: true
    },
    required_age: {
        type: String,
        required: true
    },
    on_sale_date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: false
    },
    ordered: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    previousId: {
        type: String,
        required: true
    }
})

productArchiveSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ProductArchive', productArchiveSchema);