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

router.post('/add/:sneaker_id', checkIfAuthenticated, async function(req,res){
    console.log("ADD TO CART CALLED!");
    let userId = req.session.user.id;
    let sneakerId = req.params.sneaker_id;
    let quantity = 1;

    let cartServices = new CartServices(userId);
    await cartServices.addToCart(sneakerId, quantity);
  
    console.log("REDIRECT TO CART");
    req.flash('success_messages', 'Sneaker has been added to cart');
    res.redirect('/cart');
})

router.post('/:sneaker_id/update', checkIfAuthenticated, async function(req,res){
    let newQuantity = req.body.newQuantity;
    const cartServices = new CartServices(req.session.user.id);
    await cartServices.updateQuantity(req.params.sneaker_id, newQuantity);
    req.flash('success_messages', "Quantity has been updated");
    res.redirect('/cart')
})

router.post('/:sneaker_id/remove', checkIfAuthenticated, async function(req,res){
    const cartServices = new CartServices(req.session.user.id);
    await cartServices.removeToCart(req.params.sneaker_id);
    res.redirect('/cart');
})

module.exports = router;