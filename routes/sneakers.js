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

    // get all the categories
    const allCategories = await sneakerDataLayer.getAllCategories();
    allCategories.unshift([0, "N/A"]);

    const allTags = await sneakerDataLayer.getAllTags();
 
    const searchForm = createSearchForm(allCategories, allTags);
    let query = Product.collection(); // create a query builder
                                      // write a query in increments
                                      // eqv. "SELECT * FROM products"
    searchForm.handle(req,{
        'empty':async function(form) {
            // if the user never fill in, we just return all products
            let products = await query.fetch({
                withRelated:['category', 'tags']
            })
            res.render('products/index', {
                'products': products.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        },
        'success':async function(form) {
            // if the name is provided
            if (form.data.name) {
                // add on the query
                // adding to "WHERE name LIKE '%product_name%'"" to "SELECT * FROM products"                
                query.where('name', 'like', '%' + req.query.name + '%');
            }

            if (form.data.min_cost) {
                query.where('cost', '>=', form.data.min_cost);
            }

            if (form.data.max_cost) {
                query.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.category_id && form.data.category_id != "0") {
                query.where('category_id', '=', form.data.category_id)
            }

            if (form.data.tags) {
                // query.query
                // [a]   [b]
                // a => query builder
                // b => a function named query()

                // join the products with products_tags
                // 2nd arg -> the table to join with
                // 3rd arg -> the primary key of left hand side table
                // 4th arg -> the fk of ther right hand side table
                query.query('join', 'products_tags', 'products.id','product_id')
                    .where('tag_id','in', form.data.tags.split(','));
            }            

            // execute the query
            let products = await query.fetch({
                withRelated:['category', 'tags']
            })
            res.render('products/index', {
                'products': products.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        }
    })   
})

// export the router
module.exports = router;