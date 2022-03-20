const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
// const csrf = require('csurf'); // protection vs. CRSF attacks
const cors = require('cors'); // enable cross origin resource sharing
      
require("dotenv").config();

// setup sessions and flash messaging
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable cors before sessions
app.use(cors());

// enable forms
// this is a middleware that enables us to
// access to form data in req.body
app.use(
  express.urlencoded({
    extended: false
  })
);

// inject date for all hbs files
// middleware to inject the current date
//  as variable in all hbs files.
app.use(function(req,res,next){
  res.locals.date = new Date();  // res.locals is response.locals
                                 // the locals object contain the variables for the hbs file
                                 // if we define res.lcoals.date, it means that ALL hbs files
                                 // have access to the date variable
  next();  // MUST call the next functiont to pass the request to next middleware, or if there
           // is no more middlewares,pass to the route.
})

// import in routes
const landingRoutes = require('./routes/landing');
const sneakerRoutes = require('./routes/sneakers');

async function main() {
    app.use('/', landingRoutes);
    // the first parameter is the prefix
    // the second parameter is the router object
    app.use('/sneakers', sneakerRoutes);

    // register API routes
    // all API routes will have urls that begin with '/api/'
}

main();

//LOCAL
app.listen(8080, () => {
  console.log("Server has started");
});

// PROD
// app.listen(process.env.PORT, () => {
//   console.log("Server has started");
// });