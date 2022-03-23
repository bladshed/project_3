const { CartItem } = require('../models');

// first arg: the id of the user that we want get the shopping cart for
const getCart = async function(userId) {
    let allCartItems = await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            'require': false, // it's possible that a user does not have anything in their shopping cart
            'withRelated': ['sneaker', 'sneaker.cutType', 'sneaker.brand']
        })
    return allCartItems;
}

const getCartItemByUserAndSneaker = async function(userId, sneakerId) {
    const cartItem = await CartItem.where({
        'user_id': userId,
        'sneaker_id': sneakerId
    }).fetch({
        'require': false,
        'withRelated': ['sneaker', 'sneaker.cutType', 'sneaker.brand']
    });

    return cartItem;
}

const createCartItem = async function(userId, sneakerId, quantity) {
    const cartItem = new CartItem({
        'user_id': userId,
        'sneaker_id': sneakerId,
        'quantity': quantity,
        'payment_status': 'pending',
        'delivery_status': 'tbd',
        'date_created': new Date()
    })
    await cartItem.save();
    return cartItem;
}

const updateCartItem = async function(userId, sneakerId, newQuantity) {
    let cartItem = await getCartItemByUserAndSneaker(userId, sneakerId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return true;
    }
    return false;
    
}

const deleteCartItem = async function(userId, sneakerId) {
    let cartItem = await getCartItemByUserAndSneaker(userId, sneakerId);
    if (cartItem) {
        await cartItem.destroy();
    }
    return true;
    
}

const updateCartPayment = async function(cartItems) {

    cartItems.forEach(async cartItem => {
        await cartItem.destroy();
    });
    return true;
    
}

module.exports = { getCart, getCartItemByUserAndSneaker, createCartItem, updateCartItem, deleteCartItem, updateCartPayment };