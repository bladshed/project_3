const express = require('express');
// an Express router can store routes
const router = express.Router();

// import in the model
const { Sneaker, CutType } = require('../models');

// import in creatSneakerForm and bootstrapField
const { bootstrapField, createSneakerForm, createSearchForm } = require('../forms');

const { checkIfAuthenticated} = require('../middlewares');

const sneakerDataLayer = require('../dal/sneakers');

// add routes to the routers

// list all the sneakers
router.get('/', checkIfAuthenticated, async function (req, res) {

    const searchForm = await getSneakerForm(true);

    let query = Sneaker.collection(); // create a query builder
    // write a query in increments
    // eqv. "SELECT * FROM sneakers"

    // let sneakers = await query.fetch({
    //     withRelated: ['cutType', 'brand', 'tags', 'colors']
    // })

    // res.render('sneakers/index', {
    //     'sneakers': sneakers.toJSON(),
    //     'searchForm': form.toHTML(bootstrapField)
    // })

    searchForm.handle(req,{
        'empty':async function(form) {
            // if the user never fill in, we just return all products
            let sneakers = await query.fetch({
                withRelated: ['cutType', 'brand', 'tags', 'colors']
            })
            res.render('sneakers/index', {
                'sneakers': sneakers.toJSON(),
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

            if (form.data.min_price) {
                query.where('price', '>=', form.data.min_price);
            }

            if (form.data.max_price) {
                query.where('price', '<=', form.data.max_price);
            }

            if (form.data.brand_id && form.data.brand_id != "0") {
                query.where('brand_id', '=', form.data.brand_id)
            }

            if (form.data.cut_type_id && form.data.cut_type_id != "0") {
                query.where('cut_type_id', '=', form.data.cut_type_id)
            }

            if (form.data.colors) {
                // query.query
                // [a]   [b]
                // a => query builder
                // b => a function named query()

                // join the products with products_tags
                // 2nd arg -> the table to join with
                // 3rd arg -> the primary key of left hand side table
                // 4th arg -> the fk of ther right hand side table
                query.query('join', 'colors_sneakers', 'sneakers.id','sneaker_id')
                    .where('color_id','in', form.data.colors.split(','));
            } 

            if (form.data.tags) {
                // join the products with products_tags
                // 2nd arg -> the table to join with
                // 3rd arg -> the primary key of left hand side table
                // 4th arg -> the fk of ther right hand side table
                query.query('join', 'sneakers_tags', 'sneakers.id','sneaker_id')
                    .where('tag_id','in', form.data.tags.split(','));
            }            

            // execute the query
            let sneakers = await query.fetch({
                withRelated: ['cutType', 'brand', 'tags', 'colors']
            })
            res.render('sneakers/index', {
                'sneakers': sneakers.toJSON(),
                'searchForm': form.toHTML(bootstrapField)
            })
        }
    })
})

// export the router
module.exports = router;

// add checkIfAuthenticated middleware for this route
router.get('/create', checkIfAuthenticated, async function (req, res) {

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

router.post('/create', checkIfAuthenticated, async function (req, res) {
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
            req.flash('success_messages', 'Product created successfully'); // <-- we call the req.flash() function of the app.use(flash()) in index.js
            
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

router.get('/:sneaker_id/update', checkIfAuthenticated, async function (req, res) {

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
        'sneaker': sneaker.toJSON(),
        'cloudinaryName':process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey':process.env.CLOUDINARY_API_KEY,
        'cloudinaryUploadPreset':process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:sneaker_id/update', checkIfAuthenticated, async function (req, res) {
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

router.get('/:sneaker_id/delete', checkIfAuthenticated, async function (req, res) {
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

const getSneakerForm = async function (isSearchForm) {
    // get all cut types
    const allCutTypes = await sneakerDataLayer.getAllCutTypes();

    // get all brands
    const allBrands = await sneakerDataLayer.getAllBrands();

    // get all tags
    const allColors = await sneakerDataLayer.getAllColors();

    // get all tags
    const allTags = await sneakerDataLayer.getAllTags();

    let pageForm;

    if(isSearchForm){
        // create an instance of the sneaker form
        pageForm = createSearchForm(allCutTypes, allBrands, allColors, allTags);
    } else {
        // create an instance of the sneaker form
        pageForm = createSneakerForm(allCutTypes, allBrands, allColors, allTags);
    }

    return pageForm;
}