const stripe = require('stripe')(process.env.SECRET_KEY)

// exports.createCheckoutSession = async (req, res, next) => {
//     console.log(req.body)
//   let { amount, id } = req.body
//    console.log("amount : ",amount)
//    console.log("id", id)
//    try {
//        const paymentIntent = await stripe.paymentIntents.create({
//            amount : amount, // montant de la transaction
//            currency: "EUR", //devise
//            // Stripe dashboard description
//            description: req.body.product_name,
//            // Bank record, 22 chars max
//            statement_descriptor: "LCAJ FR",

//            metadata: {
//                product_uuid : req.body.uuid
//            },
//           payment_method: id,
//           confirm: true,
//        });
//        res.status(201).json({message : 'Paiement réussi', success: true,})
//    }
//    catch(error) {
//        console.log(error);
//        res.status(500).json({ message: "Le paiement a échoué", success: false})
//    }

// }

exports.createCheckoutSession = async (req, res) => {

    //Array to push parsed data onto for line_items object in stripe session
    const lineItem = [];
    try {
        const customer = await stripe.customers.create({
            name: 'Bidoyen Mathieu',
            email: 'azariel@live.fr',
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
                name: "Bidoyen Mathieu",
                phone: "102030405"
            },
            preferred_locales: ["FR"]
        })

        for (let item of req.body) {
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
                unit_amount: req.body[0].price,
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
                quantity: item.quantity
            });

        }
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
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