const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = mongoose.Schema({
    stripe_customer_id : {type: String, required: true},
    stripe_session_id: {type: String, required: true, unique:true},
    username : {type: String, required: true},
    user_address: {type:Object, required: true},
    product : {type: Array, required: true},
    order_date : {type: Date, required: true},
    order_HT_price :{type: String, required: true},
    order_price : {type: String, required: true},
    delivery_date : {type : Date, required : true},
    delivery_price : {type: String, required :true},
    order_taxes : {type:String, required: true},
    status : {type:String, required: true},
})

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Orders', orderSchema);