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
    cutType() {
        // eqv. one product belongs to one cateogry
        return this.belongsTo('CutType')
    },
    brand() {
        // eqv. one product belongs to one cateogry
        return this.belongsTo('Brand')
    },
    tags() {
        return this.belongsToMany('Tag');
    },
    colors() {
        return this.belongsToMany('Color');
    }
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

// make sure the name of the model
// (1st parameter of the book bookshelf.model call) is the singular
// form of the table name and the first alphabet is upper case
const Brand = bookshelf.model('Brand', {
    tableName:'brands', // this model refers to the categories table in the database
                           // table name is plural
    // the relationship name is the lower case of the 
    // model name, plural (because it's hasMany relationship)
    sneakers() {
        // the arg of hasMany is the Model name
        return this.hasMany('Sneaker');
    },
})

// first arg is name of the model, so the model's name is Tag
const Tag = bookshelf.model("Tag", {
    'tableName':'tags',
    sneakers() {
        return this.belongsToMany('Sneaker');
    }
})

// first arg is name of the model, so the model's name is Tag
const Color = bookshelf.model("Color", {
    'tableName':'colors',
    sneakers() {
        return this.belongsToMany('Sneaker');
    }
})

// first arg is the name of the model, and it must be singular form of the
// table name, with the first alphabet in uppercase.
const User = bookshelf.model("User", {
    'tableName':'users'
})

module.exports = { Sneaker, CutType, Brand, Tag, Color, User };