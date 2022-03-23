const express = require('express');
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();
const CartServices = require('../services/cart_services');

router.get('/', checkIfAuthenticated, async function(req,res){
    let userId = req.session.user.id;
    const cartServices = new CartServices(userId);
    const allCartItems = await cartServices.getAllCartItems();
    res.render('cart/index',{
        'cartItems': allCartItems.toJSON()
    });
})

module.exports = router;