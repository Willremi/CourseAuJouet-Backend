const stripe = require('stripe')(process.env.SECRET_KEY)

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
                images: [item.images[0]]
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
            success_url: `http://localhost:3000/payment/?success=true`,
            cancel_url: `http://localhost:3000/payment/?canceled=true`,
        });
        res.status(200).json({
            url: session.url
        })

    } catch (e) {
        console.log(e)
    }
}