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
    cutType()  {
        // eqv. one product belongs to one cateogry
        return this.belongsTo('CutType')
    }
    // tags() {
    //     return this.belongsToMany('Tag');
    // }
})

// make sure the name of the model
// (1st parameter of the book bookshelf.model call) is the singular
// form of the table name and the first alphabet is upper case
const CutType = bookshelf.model('CutType', {
    tableName:'cut_types', // this model refers to the categories table in the database
                           // table name is plural
    // the relationship name is the lower case of the 
    // model name, plural (because it's hasMany relationship)
    sneakers() {
        // the arg of hasMany is the Model name
        return this.hasMany('Sneaker');
    },
})

module.exports = { Sneaker, CutType };