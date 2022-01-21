const Order = require('../models/order');

exports.RegisterOrder = (req, res, next) => {
    const presentTime = new Date()
    const deliveryDate = presentTime.setDate(presentTime.getDate() + 5)
    const order = new Order({
        user_id : req.body.id,
        product : req.body.cart,
        order_date : Date.now(),
        order_HT_price : req.body.pricing.TotalPrice,
        order_price : req.body.pricing.TotalPrice + req.body.pricing.taxes + req.body.pricing.Delivery,
        delivery_date: deliveryDate,
        delivery_price : req.body.pricing.Delivery,
        order_taxes : req.body.pricing.taxes,
        status : "En préparation",
    });
    order.save()
    .then((order) => {
        res.status(200).json({ message: "Votre commande a bien été enregistré !", order: order})
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "La commande n'a pas pus être enregistré"})
    })
}