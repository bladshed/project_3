const express = require('express');
// an Express router can store routes
const router = express.Router();

// import in the model
const { Sneaker, CutType } = require('../models');

// import in creatProductForm and bootstrapField
const { bootstrapField, createSneakerForm } = require('../forms');

// const { checkIfAuthenticated} = require('../middlewares');

const sneakerDataLayer = require('../dal/sneakers');

// add routes to the routers

// list all the products
router.get('/', async function (req, res) {

    // get all the sneakers
    //  const sneakers = await sneakerDataLayer.getAllSneakers();

    let query = Sneaker.collection(); // create a query builder
    // write a query in increments
    // eqv. "SELECT * FROM products"

    let sneakers = await query.fetch({
        withRelated: ['cutType']
    })

    res.render('sneakers/index', {
        'sneakers': sneakers.toJSON()
    })
})

// export the router
module.exports = router;

// add checkIfAuthenticated middleware for this route
router.get('/create', async function (req, res) {

    /* below is an example of how the choices for 
   dropdown select should look like:
   * it's an array of array.
   * each inner array represent a choice
       * element 0 is the value of the choice
       * element 1 is the display of the choice
       
    eg:  
       let choices = [
           [101, "ABC"],
           [202, "DEF"],
           [303, "GHI"]   
       ]
   */

    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    const sneakerForm = createSneakerForm(allCutTypes);

    res.render('sneakers/create', {
        // convert the form object to HTML
        // and 'format' it using the bootstrapField function
        'form': sneakerForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryUploadPreset': process.env.CLOUDINARY_UPLOAD_PRESET

    })
})

router.post('/create', async function (req, res) {
    // goal: create a new product based on the input in the forms

    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    // create an instance of the product form
    const sneakerForm = createSneakerForm(allCutTypes);
    sneakerForm.handle(req, {
        // the success function will be called
        // if the form's data as provided by the user
        // has no errors or invalid data
        'success': async function (form) {
            console.log(form.data);

            // create a new instance of the Product model
            // NOTE: an instance of a model refers to ONE row
            // inside the table
            const newSneaker = await sneakerDataLayer.createSneaker(form.data);

            // flash messages can ONLY be used before a redirect
            // req.flash('success_messages', 'New Sneaker added successfully');  // <-- we call the req.flash() function of the app.use(flash()) in index.js

            // a redirect sends a response back to the browser
            // tell it to visit the URL in the first argument
            res.redirect('/sneakers');
        },
        // the function associated with 'error' will be
        // called if the form has invalid data,
        // such as having text for cost
        'error': function (form) {
            res.render('sneakers/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:sneaker_id/update', async function (req, res) {

    const sneakerId = req.params.sneaker_id;
    // fetch one row from the table
    // using the bookshelf orm
    const sneaker = await sneakerDataLayer.getSneakerById(sneakerId);

    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    // create an instance of product form
    const sneakerForm = createSneakerForm(allCutTypes);
    // reminder: to retrieve the value field 
    // from a model instance, use .get()
    sneakerForm.fields.name.value = sneaker.get('name'); // <== retrieve the sneaker name and assign it to the form
    sneakerForm.fields.brand.value = sneaker.get('brand');
    sneakerForm.fields.price.value = sneaker.get('price');
    sneakerForm.fields.cut_type_id.value = sneaker.get('cut_type_id');
    sneakerForm.fields.image_url.value = sneaker.get('image_url');

    res.render('sneakers/update', {
        'form': sneakerForm.toHTML(bootstrapField),
        'sneaker': sneaker.toJSON()
    })
})

router.post('/:sneaker_id/update', async function (req, res) {
    // fetch the instance of the product that we wish to update
    const sneaker = await sneakerDataLayer.getSneakerById(req.params.sneaker_id);

    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    // create the product form
    const sneakerForm = createSneakerForm(allCutTypes);

    // pass the request into the product form
    sneakerForm.handle(req, {
        'success': async function (form) {
            // executes if the form data is all valid
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description)
            // product.set('category_id, form.data.category_id)
            // if ALL the names of the fields matches
            // the column names in the table, we can use the following shortcut

            // use object destructuring to extract the tags key from `form.data`
            // into the `tags` variable,
            // and all the remaining keys will go into `productData`
            // let {tags, ...productData} = form.data;

            sneaker.set(form.data);
            await sneaker.save();

            res.redirect('/sneakers');
        },
        'error': function () {
            // executes if the form data contains
            // invalid entries
        }
    })
})

router.get('/:sneaker_id/delete', async function (req, res) {
    const sneaker = await sneakerDataLayer.getSneakerById(req.params.sneaker_id);
    res.render('sneakers/delete', {
        'sneaker': sneaker.toJSON()
    })
})

router.post('/:sneaker_id/delete', async function (req, res) {
    const sneaker = await sneakerDataLayer.getSneakerById(req.params.sneaker_id);
    await sneaker.destroy(); // same as "DELETE FROM sneakers where id = ?"
    res.redirect('/sneakers');
})