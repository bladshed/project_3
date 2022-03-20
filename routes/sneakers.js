const express = require('express');
// an Express router can store routes
const router = express.Router();

// import in the model
const { Sneaker } = require('../models');

// import in creatProductForm and bootstrapField
// const {bootstrapField, createProductForm, createSearchForm} = require('../forms');

// const { checkIfAuthenticated} = require('../middlewares');

const sneakerDataLayer = require('../dal/sneakers');

// add routes to the routers

// list all the products
router.get('/', async function(req,res){

    // get all the sneakers
    const sneakers = await sneakerDataLayer.getAllSneakers();

    res.render('sneakers/index', {
        'sneakers': sneakers.toJSON()
    })
})

// export the router
module.exports = router;