// holds all the rotues related to the landing page
// landing pages are: main page, about us, contact us

const express = require('express');
const router = express.Router(); // a Router is an object that can store many routes
const { checkIfAuthenticated} = require('../middlewares');

// add in a route for the main page
router.get('/', checkIfAuthenticated, function(req,res){
    res.render('landing/index')
});

router.get('sneakers/', checkIfAuthenticated, function(req,res){
    res.render('sneakers/index');
})

router.get('/contact-us', checkIfAuthenticated, function(req,res){
    res.render('landing/contact-us');
})

module.exports = router; // export out the router so
                         // that index.js can use it