const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user_id : {type: String, required: true,},
    product : {type: Array, required: true},
    order_date : {type: Date, required: true},
    order_HT_price :{type: String, required: true},
    order_price : {type: String, required: true},
    delivery_date : {type : Date, required : true},
    delivery_price : {type: String, required :true},
    order_taxes : {type:String, required: true},
    status : {type:String, required: true},
})

module.exports = mongoose.model('Orders', orderSchema);