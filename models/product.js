const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const productSchema = mongoose.Schema({
            product_name: {type: String, required:true, unique: true},
            description:  {type: String, required:true},
            images: {type: [String], required:true},
            price: {type: Number, required: true},
            stock: {type: Number, required: true},
            trademark:  {type: String, required:true},
            required_age: {type: Number, required: true},
            on_sale_date: {type: Date, required: true},
            category:  {type: String, required:true},
            ordered: {type: Number, required:true},
})

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Products', productSchema);