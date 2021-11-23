const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const storeSchema = mongoose.Schema({
    product: [{
        product_code: {
            type: mongoose.Types.ObjectId,
            require: true
        },
        product_name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
})

storeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Store', storeSchema);

