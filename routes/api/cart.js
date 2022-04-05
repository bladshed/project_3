const express = require('express');
const { checkIfAuthenticatedWithJWT } = require('../../middlewares');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/:user_id', checkIfAuthenticatedWithJWT, async function(req,res){
    let userId = req.params.user_id;
    const cartServices = new CartServices(userId);
    const allCartItems = await cartServices.getAllCartItems();
    res.json({
        'cartItems': allCartItems.toJSON()
    });
})

router.post('/:user_id/add', checkIfAuthenticatedWithJWT, async function(req,res){
    let userId = req.params.user_id;
    let sneakerId = req.body.sneaker_id;
    let quantity = 1;

    let cartServices = new CartServices(userId);
    await cartServices.addToCart(sneakerId, quantity);
  
    res.json({
        'success_message': 'Sneaker has been added to cart'
    });
})

router.put('/:user_id/update', checkIfAuthenticatedWithJWT, async function(req,res){
    let userId = req.params.user_id;
    let sneakerId = req.body.sneaker_id;
    let newQuantity = req.body.new_quantity;

    const cartServices = new CartServices(userId);
    await cartServices.updateQuantity(sneakerId, newQuantity);

    res.json({
        'success_message': 'Quantity has been updated'
    });
})

router.delete('/:user_id/remove', checkIfAuthenticatedWithJWT, async function(req,res){
    let userId = req.params.user_id;
    let sneakerId = req.body.sneaker_id;
    const cartServices = new CartServices(userId);
    await cartServices.removeToCart(sneakerId);

    res.json({
        'success_message': 'Item has been removed'
    });
})

module.exports = router;