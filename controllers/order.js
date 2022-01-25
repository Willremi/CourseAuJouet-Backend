const Order = require('../models/order');

exports.createOrder = (session) => {
    const stripe = require('stripe')(process.env.SECRET_KEY)
    stripe.checkout.sessions.listLineItems(
  session.id,
  { limit: 5 },
  async function(err, lineItems) {
    if(lineItems){
        var listLineItems = lineItems
    const presentTime = new Date()
    const deliveryDate = presentTime.setDate(presentTime.getDate() + 5)
    const order = new Order({ 
        stripe_customer_id : session.customer,
        stripe_session_id : session.id, 
        username : session.shipping.name,
        user_address : session.shipping.address,
        product : listLineItems.data,
        order_date : Date.now(),
        order_HT_price : session.amount_subtotal,
        order_price : session.amount_total,
        delivery_date: deliveryDate,
        delivery_price : session.total_details.amount_shipping,
        order_taxes : session.total_details.amount_tax,
        status : "awaiting payment",
    });
    order.save()
    .then(() => {
     console.log("Votre commande a bien été enregistré !"); 
    })
    .catch((error) => {
        console.log(error);
    })
    }
    if(err){
        console.log(err);
        return err
    }
  }
    
);

}

exports.getOneOrder = (req, res, next ) => {
    Order.findOne({ stripe_session_id: req.params.id })
    .then((order) => res.status(200).json({ order }))
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Une erreur est survenu lors de la récupération de la commande"})
    })
}