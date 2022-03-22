const { Sneaker, CutType, Brand, Tag, Color } = require('../models')

async function getAllSneakers() {
    // when using the model as a class, we are referring
    // to the entire table
    let sneakers = await Sneaker.fetchAll();
    return sneakers;
}

async function createSneaker(sneakerData) {
    const newSneaker = new Sneaker();
    newSneaker.set('name', sneakerData.name);
    newSneaker.set('price', sneakerData.price);
    newSneaker.set('brand_id', sneakerData.brand_id);
    newSneaker.set('cut_type_id', sneakerData.cut_type_id);
    newSneaker.set('image_url', sneakerData.image_url);

    await newSneaker.save();
    return newSneaker;
}

async function getSneakerById(sneakerId) {
    const sneaker = await Sneaker.where({
        'id': sneakerId
    }).fetch({
        'require':false,
        withRelated:['tags','colors'] // fetch all the tags associated with the product
    });
    return sneaker;
}

async function getAllCutTypes() {
    const allCutTypes = await CutType.fetchAll().map(function(cutType){
        return [ cutType.get('id'), cutType.get('name')]
    });
    return allCutTypes;
}

async function getAllBrands() {
    const allBrands = await Brand.fetchAll().map(function(brand){
        return [ brand.get('id'), brand.get('name')]
    });
    return allBrands;
}

async function getAllTags() {
    const allTags = await Tag.fetchAll().map(function(tag){
        return [ tag.get('id'), tag.get('name')]
    })
    return allTags;
}

async function getAllColors() {
    const allColors = await Color.fetchAll().map(function(color){
        return [ color.get('id'), color.get('name')]
    })
    return allColors;
}

module.exports = { getAllSneakers, createSneaker, getSneakerById, getAllCutTypes, getAllBrands, getAllTags, getAllColors }