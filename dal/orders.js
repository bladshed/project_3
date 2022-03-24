const { Order } = require('../models')

async function getAllOrders() {
    // when using the model as a class, we are referring
    // to the entire table
    let orders = await Order.fetchAll();
    return orders;
}

async function createOrder(userId, orderNumber) {
    const newOrder = new Order();
    newOrder.set('order_number', orderNumber);
    newOrder.set('user_id', userId);
    newOrder.set('delivery_status', 'in transit');
    newOrder.set('date_created', new Date());

    await newOrder.save();
    return newOrder;
}

async function getOrderById(orderId) {
    const order = await Order.where({
        'id': orderId
    }).fetch({
        'require':false,
        withRelated:['user'] 
    });
    return order;
}

module.exports = { getAllOrders, createOrder, getOrderById }