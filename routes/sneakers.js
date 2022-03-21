const express = require('express');
// an Express router can store routes
const router = express.Router();

// import in the model
const { Sneaker, CutType } = require('../models');

// import in creatSneakerForm and bootstrapField
const { bootstrapField, createSneakerForm } = require('../forms');

// const { checkIfAuthenticated} = require('../middlewares');

const sneakerDataLayer = require('../dal/sneakers');

// add routes to the routers

// list all the sneakers
router.get('/', async function (req, res) {

    let query = Sneaker.collection(); // create a query builder
    // write a query in increments
    // eqv. "SELECT * FROM sneakers"

    let sneakers = await query.fetch({
        withRelated: ['cutType', 'brand', 'tags', 'colors']
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

    // create an instance of the sneaker form
    const sneakerForm = await getSneakerForm();

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
    // goal: create a new sneaker based on the input in the forms

    // create an instance of the sneaker form
    const sneakerForm = await getSneakerForm();
    sneakerForm.handle(req, {
        // the success function will be called
        // if the form's data as provided by the user
        // has no errors or invalid data
        'success': async function (form) {
            console.log(form.data);

            // create a new instance of the Sneaker model
            // NOTE: an instance of a model refers to ONE row
            // inside the table
            const newSneaker = await sneakerDataLayer.createSneaker(form.data);

            // create the sneaker first, then save the tags
            // beause we need the sneaker to attach the tags
            if (form.data.tags) {
                let selectedTags = form.data.tags.split(',');
                // attach the sneaker with the categories
                // which ids are in the array argument 
                await newSneaker.tags().attach(selectedTags);
            }

            if (form.data.colors) {
                let selectedColors = form.data.colors.split(',');
                // attach the sneaker with the categories
                // which ids are in the array argument 
                await newSneaker.colors().attach(selectedColors);
            }

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

    // create an instance of the sneaker form
    const sneakerForm = await getSneakerForm();
    // reminder: to retrieve the value field 
    // from a model instance, use .get()
    sneakerForm.fields.name.value = sneaker.get('name'); // <== retrieve the sneaker name and assign it to the form
    sneakerForm.fields.price.value = sneaker.get('price');
    sneakerForm.fields.brand_id.value = sneaker.get('brand_id');
    sneakerForm.fields.cut_type_id.value = sneaker.get('cut_type_id');
    sneakerForm.fields.image_url.value = sneaker.get('image_url');

    // get only the ids from the tags that belongs to the sneaker
    const selectedTags = await sneaker.related('tags').pluck('id');

    // set the existing tags
    sneakerForm.fields.tags.value = selectedTags;

    // get only the ids from the colors that belongs to the sneaker
    const selectedColors = await sneaker.related('colors').pluck('id');

    // set the existing colors
    sneakerForm.fields.colors.value = selectedColors;

    res.render('sneakers/update', {
        'form': sneakerForm.toHTML(bootstrapField),
        'sneaker': sneaker.toJSON()
    })
})

router.post('/:sneaker_id/update', async function (req, res) {
    // fetch the instance of the sneaker that we wish to update
    const sneaker = await sneakerDataLayer.getSneakerById(req.params.sneaker_id);

    // create an instance of the sneaker form
    const sneakerForm = await getSneakerForm();

    // pass the request into the sneaker form
    sneakerForm.handle(req, {
        'success': async function (form) {

            // use object destructuring to extract the tags key from `form.data`
            // into the `tags` variable,
            // and all the remaining keys will go into `sneakerData`
            let {tags, colors, ...sneakerData} = form.data;

            sneaker.set(sneakerData);
            await sneaker.save();

            //*****************************************************************************************
            //******************************** TAGS ***************************************************
            //*****************************************************************************************
            let tagIds = tags.split(','); // change for example '1,2,3' into [1,2,3]

            // get all the existing tags inside the sneaker
            let existingTagIds = await sneaker.related('tags').pluck('id');
            console.log("existingTagIds=",existingTagIds);

            // find all the tags to remove
            let toRemove = existingTagIds.filter( function(id){
                return tagIds.includes(id) === false;
            });

            console.log("toRemoveTags=", toRemove);
            await sneaker.tags().detach(toRemove);
            await sneaker.tags().attach(tagIds)

            //*****************************************************************************************
            //****************************** COLORS ***************************************************
            //*****************************************************************************************
            let colorIds = colors.split(','); // change for example '1,2,3' into [1,2,3]

            // get all the existing colors inside the sneaker
            let existingColorIds = await sneaker.related('colors').pluck('id');
            console.log("existingColorIds=",existingColorIds);

            // find all the colors to remove
            let toRemoveColors = existingColorIds.filter( function(id){
                return colorIds.includes(id) === false;
            });

            console.log("toRemoveColors=", toRemoveColors);
            await sneaker.colors().detach(toRemoveColors);
            await sneaker.colors().attach(colorIds)

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

//////////////////////////////////////////////////////////////////////////////
// GLOBAL FUNCTION
//////////////////////////////////////////////////////////////////////////////

const getSneakerForm = async function () {
    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    // get all brands
    const allBrands = await sneakerDataLayer.getAllBrands();

    // get all tags
    const allColors = await sneakerDataLayer.getAllColors();

    // get all tags
    const allTags = await sneakerDataLayer.getAllTags();

    // create an instance of the sneaker form
    const sneakerForm = createSneakerForm(allCutTypes, allBrands, allColors, allTags);

    return sneakerForm;
}