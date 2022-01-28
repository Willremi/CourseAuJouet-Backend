const stripe = require('stripe')(process.env.SECRET_KEY)
const Order = require('../models/order');
const { createOrder } = require('./order');

const fulfillOrder = (session) => {
  Order.findOneAndUpdate({stripe_session_id : session.id},{
    status : session.payment_status
  })
  .then(() => console.log("Status payé !"))
  .catch((err) => {
    console.log(err);
  })
}

exports.createCheckoutSession = async (req, res) => {
     
    // Array to push parsed data onto for line_items object in stripe session
    const lineItem = [];
    try {
        const customer = await stripe.customers.create({
            name: req.body.user.firstname + " " + req.body.user.lastname,
            email: req.body.user.email,
            address: {
                city: "Lille",
                country: "France",
                line1: "9 rue des Saules, Euratechnologie",
                postal_code: "59000",
                state: "Nord"
            },
            shipping: {
                address: {
                    city: "Lille",
                    country: "FR",
                    line1: "9 rue des Saules, Euratechnologie",
                    postal_code: "59000",
                    state: "Nord"
                },
                name: req.body.user.firstname + " " + req.body.user.lastname,
                phone: req.body.user.phone
            },
            preferred_locales: ["FR"]
        })

        const taxRate = await stripe.taxRates.create({
            display_name: 'TVA',
            inclusive: false,
            percentage: 20,
            country: 'FR',
            jurisdiction: 'FR',
            description: 'Taxe sur la Valeur Ajoutée (TVA)',
          });

        for (let item of req.body.cart) {
            // I create a new product and price via Stripe on this project,
            // normally it will be necessary to do so when creating
            // a new product in general that will be registered in our
            // BDD and the BDD of Stripe. Next time you will have to find the product and the price via its "id"


            const product = await stripe.products.create({
                name: item.product_name,
                images: item.images
            })

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: item.price,
                currency: 'eur',
            })

            lineItem.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        images: product.images,
                    },
                    unit_amount: price.unit_amount,
                },
                quantity: item.quantity,
                tax_rates: [taxRate.id],
            });

        }
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['FR'],
              },
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 0,
                      currency: 'eur',
                    },
                    display_name: 'Livraison en magasin',
                    // Delivers between 5-7 business days
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 3,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 5,
                      },
                    }
                  }
                },
                {
                  shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                      amount: 0,
                      currency: 'eur',
                    },
                    display_name: 'En point relais',
                    // Delivers in exactly 1 business day
                    delivery_estimate: {
                      minimum: {
                        unit: 'business_day',
                        value: 3,
                      },
                      maximum: {
                        unit: 'business_day',
                        value: 5,
                      },
                    }
                  }
                },
                {
                    shipping_rate_data: {
                      type: 'fixed_amount',
                      fixed_amount: {
                        amount: 350,
                        currency: 'eur',
                      },
                      display_name: 'Livraison à domicile',
                      // Delivers in exactly 1 business day
                      delivery_estimate: {
                        minimum: {
                          unit: 'business_day',
                          value: 3,
                        },
                        maximum: {
                          unit: 'business_day',
                          value: 5,
                        },
                      }
                    }
                  },
              ],
            line_items: lineItem,
            mode: 'payment',
            success_url: `http://localhost:3000/payment/success?id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment/cancel?`,
        });
        res.status(200).json({
            url: session.url,
            id: session.id,
        })

    } catch (e) {
        console.log(e)
    }
}

exports.checkoutSessionCompleted = (req, res) => {
  const endpointSecret = process.env.STRIPE
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }
  catch(err){
    console.log("ERREUR : ", err.message);
    return res.status(400).json({message: `Webhook Error: ${err.message}`});
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
     
      // Save an order in your database, marked as 'awaiting payment'
      createOrder(session);

      // Check if the order is paid (for example, from a card payment)
      //
      // A delayed notification payment will have an `unpaid` status, as
      // you're still waiting for funds to be transferred from the customer's
      // account.
      if (session.payment_status === 'paid') {
        fulfillOrder(session);
      }

      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;

      // Fulfill the purchase...
     fulfillOrder(session);

      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;
      console.log('Send an email to the customer asking them to retry their order');
      // emailCustomerAboutFailedPayment(session);

      break;
    }
  }
  
  res.status(200).end()
}

exports.getCheckoutSession = async (req, res, next) => {
  var OrderedProduct = {}
  const session = await stripe.checkout.sessions.retrieve(req.params.id)
  .then((session) => {
    OrderedProduct.session = session
   
  })
  .catch((error) => console.log(error))

  const listItems = await stripe.checkout.sessions.listLineItems(req.params.id)
  .then((Items) => {
    OrderedProduct.product = Items})
  .catch((error) => console.log(error))

  res.status(200).json({ OrderedProduct })
}