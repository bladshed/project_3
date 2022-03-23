const cartDataLayer = require('../dal/cart_items');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getAllCartItems() {
        const allCartItems = await cartDataLayer.getCart(this.user_id);
        return allCartItems;
    }

    async addToCart(sneakerId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndSneaker(this.user_id, sneakerId);
        if (cartItem) {
            cartDataLayer.updateCartItem(this.user_id, sneakerId, cartItem.get('quantity') + quantity)
        } else {
             // todo: check whether if there is enough stock       
             await cartDataLayer.createCartItem(this.user_id, sneakerId, quantity);
        }
        return cartItem;
    }

    async removeToCart(sneakerId) {
        let status = await cartDataLayer.deleteCartItem(this.user_id, sneakerId);
        return status;
    }

    async updateQuantity(sneakerId, newQuantity) {
        let status = await cartDataLayer.updateCartItem(this.user_id, sneakerId, newQuantity);
        return status;
    }

    async updatePayment(items) {
        let status = await cartDataLayer.updateCartPayment(items);
        return status;
    }
}

module.exports = CartServices;