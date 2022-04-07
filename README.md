### PROJECT OVERVIEW
This project was made for sneakerheads or people who like buying sneakers.

This will help sneakerheads to easily but the sneakers that they want, also, it has an admin page that can control which sneaker will be sold to the market.

Live link to my Web Application --> 
   - [HBS](https://project-3-hbs.herokuapp.com/)
   - [VUE](https://loquacious-naiad-713bf7.netlify.app/)


## BUSINESS

### Business problem
1) Business problem solving
   * search engine is too broad and choices are not focused according to user preference
   * not all web links shown on search engine are market sites where you can buy that shoe you want

2) What was the solution
   * to have a repository of sneakers to be sold in the market
   * to focus on the specific sneakers they want to buy

3) Results of the implementation
   * the application was tried and tested by selected individuals and made the following comments.
      * USER
         * User was able to view sneakers that are available
         * User was able to search sneakers that they want
         * User was able add to cart the sneaker they want to buy
         * User was checkout the sneakers they want to buy

      * ADMIN
         * Admin user was able to do what a user can do
         * Admin user was able to add/edit/delete sneaker
         * Admin user was able to see orders of all users
         * Admin user was able to update orders of all users

4) Lessons learned
   * What was done well?
      * implementing hbs made it easier for me to develop since the scope is front end and backend so it lessens the code I need to write
      * client-server communication was done nicely
      * deploying and updating the application was okay
      * testing the application was smooth because some of my friends helped me
   
   * What didn't go that well?
      * UI was not very nice since I didn't have enough time to do it because I was also busy with my work
      * implementing technologies that you are not yet very familiar with was very challenging since you need to learn so many things, it is very time consuming
      * applying Stripe on my Vue js had caused me so much troubles. Shun even tried to help me but failed to fixed my bugs.

   * What else could be improved?
      * Improve UI to make it more pleasing to users
      * To have a better User Management System


### FEATURES
* USER
   * Able to create your own account
   * Able to login
   * Able to view sneakers
   * Able to add to cart
   * Able to checkout you orders
   * Able to go to pages
   * The main feature of this web application is the reactive programming that handles real-time updates

* ADMIN
   * Able to do what a user can do
   * Able to add, delete, modify a sneaker
   * Able to view orders


### USER STORIES
* USER
   * US01. As a user, I want to create a user account.
   * US02. As a user, I want to login to see the web app.
   * US03. As a user, I want to view sneakers that are available.
   * US04. As a user, I want to add to cart the sneaker I want to buy. 
   * US05. As a user, I want to checkout my orders.

* USER
   * US06. As a admin, I want to do what a user can do.
   * US07. As a admin, I want to add, edit, delete a sneaker.
   * US08. As a admin, I want to view all the user orders.


## TECHNICAL

### Understanding of the business problem
* I need to have a database for sneaker market web app
* Build a search engine that returns only what is relevant
* To allow admin to do CRUD for a sneaker
* To allow user to view sneakers
* To allow admin to upload a photo of the sneaker
* To allow Stipe checkout

### UI/UX
* [Wireframes link](src/images)

* The design fonts colors revolves in neutral color because the background that I used is simple. For buttons, I used green, blue and red, I chose these colors because it represents the nature's colors, blue and green are very pleasing to the eyes, red to catch the attention.


### Architectural decisions and constraints

* Github for CI/CD

* IDE
   * Visual Studio Code
      * Pros:
         * developer friendly
         * can develop both backend and frontend
      * Cons:
         * not yet familiar

* DATABASE
   * MySQL/PostgreSQL
      * Pros:
         * security
         * data is consistent
      * Cons:
         * designing the db is more complex than MongoDB
         * slower
   
   * Cloudinary
      * Pros:
         * provides a way to upload your images
      * Cons:
         * no api to call to change the previous images or delete your images

* BACKEND
   * Node js
      * Pros:
         * uses javascript
         * lightweight
         * most language used in development so it is easier to connect to other systems
      * Cons:
         * not yet familiar

* FRONTEND
   * Vue js
      * Pros:
         * uses javascript
         * reactive programming (real-time update)
         * less development time
      * Cons:
         * new technology, need time to learn

   * Bootstrap
      * Pros:
         * provides basic element designs
         * helps to manipulate html elements 
         * save time in designing your UI
      * Cons:
         * heavyweight
   

### DEPENDENCIES USED
   * bootstrap-vue
      * I used this for my pop-up modals when adding, editing or viewing outfit data.

   * Google fonts and Font awesome
      * these two libraries were used for my fonts and icons. They have cool fonts and icons.

   * Express
      * provides a thin layer of fundamental web application features
   
   * HBS
      * helps to develop an application that connects backend and frontend
   
   * bookshelf
      * serves as ORM, helps to convert javascript to db script to communicate to database
   
   * Stripe
      * used this dependency to be able to test my payment feature


### FUNCTIONAL AND NON FUNCTIONAL REQUIREMENTS

* Functional
   * Able to create a user account
   * Able to login
   * Able to create csrf token when using non API
   * Able to create token when using API
   * Able to create, read, update and delete a sneaker
   * Able to secure pages

* Non-Functional
   * Performance
      * API calls takes less than 2 seconds
      * Database read/write takes less than 2 second to process
   
   * Storage
      * Cannot store too many data since I am only using free edition

   * Security
      * Application grants all access for admin user
      * Token is used to prevent direct access to APIs
      * Prevent accessing to pages if not logged in

   * Portability and compatibility
      * Works with any browsers
      * Works with any OS as long as it uses web browser
      * Works with phones and tablets

   * Maintainability
      * Bug fix many only take a some time since I used Vue and HBS
      * Hard to troubleshoot because Im not yet familiar with Vue js and HBS
   
   * Availability
      * Application is always accessible to users any time
      * Need to login to be able to use the web applicaiton

   * Usability
      * Application is pretty straight forward
      * UI is very simple and easy to understand
   

### High Level Design
* [HLD link](src/images)

### PROJECT SETUP
```
yarn install
```

#### Compiles and hot-reloads for development
```
yarn serve
```

#### Compiles and minifies for production
```
yarn build
```

#### Lints and fixes files
```
yarn lint
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Build & Deployment
* Initialize project
   * npm install -g @vue/cli
   * vue create .
   * yarn add bootstrap
   * npm i -g @vue/cli-service-global
   * yarn add axios
   * npm i bootstrap-vue
   * yarn add @fortawesome/fontawesome-svg-core@next (optional)
   * yarn add @fortawesome/free-solid-svg-icons@next (optional)
   * yarn add @fortawesome/free-regular-svg-icons@next (optional)
   * yarn add @fortawesome/vue-fontawesome@latest (optional)
   * yarn add qs (optional)

* Commit and push changes
   * git commit -m "commit message"

* BACKEND
   * Deploy to Heroku
      * Register an account with Heroku at [https://www.heroku.com](https://www.heroku.com)
      * At the terminal, log in to heroku with:
         * heroku login -i
      * heroku create <app-name>
      * Add a start script to package.json
      * git push heroku master
      * Setup the config variables in Heroku client app

* FRONTEND
   * Deploy to Netlify
      * Register an account with Netlify at [https://www.netlify.com](https://www.netlify.com/)
      * Add A New Project
      * Link your Github account and authorize Netlify
      * Select Your Repo
      * Configure Your Settings
   * Every time you commit and push to your github, Netlify will get the latest code


### APIs

BASE URL: https://project-3-hbs.herokuapp.com

* USERS (/users)
   * /register (POST)
      * body params: first_name, last_name, email, password
      * success: returns success message
   * /login (POST)
      * body params: email, password
      * success: returns json object (userId, accessToken, refreshToken)
   * /refresh (POST)
      * body params: refreshToken
      * success: returns accessToken
   * /logout (POST)
      * body params: refreshToken
      * success: returns success message

* SNEAKERS (/sneakers)
   * / (GET)
      * body params: 
      * success: returns json sneakers array object

* CART (/cart)
   * /:user_id (GET)
      * body params: user_id
      * success: returns json cartItems array object
   * /:user_id/add (POST)
      * url params: user_id
      * body params: sneaker_id
      * success: returns success message
   * /:user_id/update (PUT)
      * url params: user_id
      * body params: sneaker_id, new_quantity
      * success: returns success message
   * /:user_id/remove (DELETE)
      * url params: user_id
      * body params: sneaker_id
      * success: returns success message


### TEST CASES (FULL STACK)
<table>
   <tr>
      <th colspan=2>Login Page
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </td>
   </tr>
   <tr>
      <td>Create User</td>
      <td>Created new User account</td>
   </tr>
   <tr>
      <td>Login</td>
      <td>Logged in using your account</td>
   </tr>
   <tr>
      <th colspan=2>Sneaker Market
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </td>
   </tr>
   <tr>
      <td>Logout</td>
      <td>Logged out from the web app</td>
   </tr>
   <tr>
      <td>[USER] Go to Sneakers page</td>
      <td>View all Sneakers</td>
   </tr>
   <tr>
      <td>[USER] Search sneakers (based on filter)</td>
      <td>Show filtered Sneaker list</td>
   </tr>
   <tr>
      <td>[USER] Add to cart</td>
      <td>Added to cart</td>
   </tr>
   <tr>
      <td>[USER] Go to cart</td>
      <td>See all user cart items</td>
   </tr>
   <tr>
      <td>[USER] Modify quantity</td>
      <td>Modified quantity</td>
   </tr>
   <tr>
      <td>[USER] Checkout cart items</td>
      <td>Redirects to Stripe payment</td>
   </tr>
   <tr>
      <td>[ADMIN] Do all things a user can do</td>
      <td>Can do what a user can do</td>
   </tr>
   <tr>
      <td>[ADMIN] Add Sneaker</td>
      <td>Added new Sneaker</td>
   </tr>
   <tr>
      <td>[ADMIN] Edit Sneaker</td>
      <td>Edited Sneaker</td>
   </tr>
   <tr>
      <td>[ADMIN] Delete Sneaker</td>
      <td>Deleted Sneaker</td>
   </tr>
   <tr>
      <td>[ADMIN] Go to Orders</td>
      <td>See all user orders</td>
   </tr>
</table>


### TEST CASES (APIs)
<table>
   <tr>
      <th colspan=2>User APIs
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </td>
   </tr>
   <tr>
      <td>Register user</td>
      <td>Returns json success message</td>
   </tr>
   <tr>
      <td>Login user</td>
      <td>Returns json object (userId, accessToken, refreshToken)</td>
   </tr>
   <tr>
      <td>Refresh token</td>
      <td>Returns accessToken</td>
   </tr>
   <tr>
      <td>Logout user</td>
      <td>Returns success message</td>
   </tr>

   <tr>
      <th colspan=2>Sneaker APIs
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </td>
   </tr>
   <tr>
      <td>Get all sneakers</td>
      <td>Returns json sneakers array object</td>
   </tr>

   <tr>
      <th colspan=2>Cart APIs
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </td>
   </tr>
   <tr>
      <td>Get cart items by user</td>
      <td>Returns json cartItems array object</td>
   </tr>
   <tr>
      <td>Add to cart</td>
      <td>Returns success message</td>
   </tr>
   <tr>
      <td>Update to cart quantity</td>
      <td>Returns success message</td>
   </tr>
   <tr>
      <td>Remove cart item</td>
      <td>Returns success message</td>
   </tr>
</table>


### CREDITS
* Thanks to Mr Paul Chor, our teacher for Node js, Express and Vue js
* Thanks to Neelima for the Algo lessons that helped my application to be more efficient
* Thanks to Shun and Alex for helping me to finish my Vue js app
* For my code snippets, tutorial, questions and images souces came from Google
   * [Google](https://www.google.com/)
