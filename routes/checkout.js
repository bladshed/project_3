const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services');
const orderDataLayer = require('../dal/orders');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async function (req, res) {
    // step 1. create the line items
    // each line item is one item that the user has to pay off
    // imagine it as each line in an invoice, recepit
    //
    // create one line item for each item in the shopping cart

    // 1a - get all the items from current logged in user's shopping cart
    const cartServices = new CartServices(req.session.user.id);
    const items = await cartServices.getAllCartItems();

    // 1b - for each item in the items array, create a line item
    const lineItems = [];
    const meta = [];
    for (let i of items) {
        const lineItem = {
            'name': i.related('sneaker').get('name'),
            'amount': i.related('sneaker').get('price') * 100,
            'quantity': i.get('quantity'),
            'currency': 'SGD'
        }

        // check if the sneaker has image
        //if the sneaker has image, add it to the lineitem as well
        if (i.related('sneaker').get('image_url')) {
            lineItem['images'] = [i.related('sneaker').get('image_url')];
            // Stripe expect the images of a line item to be an array
            // so we only have one image per sneaker, so that's why we enclosed it around [ ]
            // so that it can be inside an array
        }

        lineItems.push(lineItem);

        // add to the meta data to remember for each sneaker, what is the quantity purchased
        meta.push({
            'sneaker_id': i.get('sneaker_id'),
            'quantity': i.get('quantity')
        })
    }

    // step 2: create stripe payment and get the stripe session id
    let metaData = JSON.stringify(meta); //convert an array into a JSON string
    const payment = {
        'payment_method_types': ['card'],
        'line_items': lineItems,
        'success_url': process.env.STRIPE_SUCCESS_URL,
        'cancel_url': process.env.STRIPE_CANCEL_URL,
        'metadata': {
            'orders': metaData
        }
    }
    // step 3: get the session id from stripes 
    const stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success/:sessionId', async function (req, res) {
    console.log(req.params.sessionId);

    // get user id
    let userId = req.session.user.id;

    // get all cart items
    const cartServices = new CartServices(userId);
    const items = await cartServices.getAllCartItems();

    console.log("ITEMS: " + JSON.stringify(items));
    let ids = [];
    items.forEach(cartItem => {
        ids.push(cartItem.id)
    });
    let orderNumber = ids.reduce((total, id) => {
        return total + id;
    });
    
    // create new order
    const orderId = await orderDataLayer.createOrder(userId,orderNumber);
    console.log(orderId);

    // update cart_items
    const status = await cartServices.updatePayment(items);
    console.log("STATUS: " + status);

    res.render('checkout/success')
})

router.get('/cancel', function (req, res) {
    res.render('checkout/cancel')
})

router.post('/process_payment', express.raw({
    'type': 'application/json'
}), async function (req, res) {
    let payload = req.body; // payload is whatever Stripe is sending us
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        // if there is no error, event should contains detail of the payment
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);


    } catch (e) {
        res.send({
            'error': e.message
        })
        console.log(e);
    }
    // check if the event is payment completed
    if (event.type == 'checkout.session.completed') {
        // retrieve the stripe session
        let stripeSession = event.data.object;
        let orders = JSON.parse(stripeSession.metadata.orders);

        console.log("PAYMENT SUCCESSFUL");

        // const cartServices = new CartServices(req.session.user.id);
        // const items = await cartServices.getAllCartItems();
        // console.log("ITEMS: " + JSON.stringify(items));
        // const status = await cartServices.updatePayment(items);
        // console.log("STATUS: " + status);

        // 1. create a model to represent each invoice item
        // - create migration file
        // - create the models
        // 2. for each line item, store the quantity ordered and associated sneaker iod
    }
    res.send({
        'recieved': true
    })
})

module.exports = router;