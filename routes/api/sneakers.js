const express = require('express')
const router = express.Router();
const sneakerDataLayer = require('../../dal/sneakers');
const { Sneaker } = require('../../models');
const { checkIfAuthenticatedWithJWT } = require('../../middlewares');

router.get('/', checkIfAuthenticatedWithJWT, async function(req,res){
    let query = Sneaker.collection();

    let sneakers = await query.fetch({
        withRelated: ['cutType', 'brand', 'tags', 'colors']
    })
    res.json({
        'sneakers': sneakers.toJSON()
    })
})

// POST /api/products
// allow user to add in new products

module.exports = router;
