const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services');
const orderDataLayer = require('../../dal/orders');

router.get('/success/:userId', async function (req, res) {

    // get user id
    let userId = req.params.userId;

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

    res.json({
        'success_message': 'Payment Successful'
    });
})

module.exports = router;