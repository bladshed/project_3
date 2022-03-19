// if we require a direcyory or folder instead a file
// nodejs will default to look for index.js
const bookshelf = require('../bookshelf');

// for consistency, we keep the name of the model
// to be the same as the database, but singular and the
// first alphabet is uppercase
const Sneaker = bookshelf.model('Sneaker',{
    tableName:'sneakers', // which table is this model referring to
    // name of the relationship is the function name (below)
    // keep the name of the relationship to be the model name lowercase
    // it is singular because of belongsTo
    // category()  {
    //     // eqv. one product belongs to one cateogry
    //     return this.belongsTo('Category')
    // },
    // tags() {
    //     return this.belongsToMany('Tag');
    // }
})

module.exports = { Product };