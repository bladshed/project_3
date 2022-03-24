const express = require('express');
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();
const orderDataLayer = require('../dal/orders');
const { Order } = require('../models');
// import in creatSneakerForm and bootstrapField
const { bootstrapField, createOrderForm } = require('../forms');

router.get('/', checkIfAuthenticated, async function(req,res){
    
    let query = Order.collection(); 

    let orders = await query.fetch({
        withRelated: ['user']
    })
    res.render('orders/index', {
        'orders': orders.toJSON(),
    })
})

router.get('/:order_id/update', checkIfAuthenticated, async function (req, res) {

    const orderId = req.params.order_id;
    // fetch one row from the table
    // using the bookshelf orm
    const order = await orderDataLayer.getOrderById(orderId);

    // create an instance of the sneaker form
    const orderForm = await createOrderForm();
    // reminder: to retrieve the value field 
    // from a model instance, use .get()
    orderForm.fields.delivery_status.value = order.get('delivery_status'); // <== retrieve the sneaker name and assign it to the form

    res.render('orders/update', {
        'form': orderForm.toHTML(bootstrapField),
        'order': order.toJSON()
    })
})

router.post('/:order_id/update', checkIfAuthenticated, async function (req, res) {
    // fetch the instance of the sneaker that we wish to update
    const order = await orderDataLayer.getOrderById(req.params.order_id);

    // create an instance of the sneaker form
    const orderForm = await createOrderForm();

    // pass the request into the sneaker form
    orderForm.handle(req, {
        'success': async function (form) {

            order.set(form.data);
            await order.save();

            res.redirect('/orders');
        },
        'error': function () {
            // executes if the form data contains
            // invalid entries
        }
    })
})

router.get('/:order_id/delete', checkIfAuthenticated, async function (req, res) {
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    res.render('orders/delete', {
        'order': order.toJSON()
    })
})

router.post('/:order_id/delete', async function (req, res) {
    const order = await orderDataLayer.getOrderById(req.params.order_id);
    await order.destroy(); // same as "DELETE FROM sneakers where id = ?"
    res.redirect('/orders');
})

module.exports = router;