const { Sneaker, CutType } = require('../models')

async function getAllSneakers() {
    // when using the model as a class, we are referring
    // to the entire table
    let sneakers = await Sneaker.fetchAll();
    return sneakers;
}

async function createSneaker(sneakerData) {
    const newSneaker = new Sneaker();
    newSneaker.set('name', sneakerData.name);
    newSneaker.set('brand', sneakerData.brand);
    newSneaker.set('price', sneakerData.price);
    newSneaker.set('cut_type_id', sneakerData.cut_type_id);

    await newSneaker.save();
    return newSneaker;
}

async function getSneakerById(sneakerId) {
    const sneaker = await Sneaker.where({
        'id': sneakerId
    }).fetch({
        'require':false
    });
    return sneaker;
}

async function getAllCutTypes() {
    const allCutTypes = await CutType.fetchAll().map(function(cutType){
        return [ cutType.get('id'), cutType.get('name')]
    });
    return allCutTypes;
}

module.exports = { getAllSneakers, createSneaker, getSneakerById, getAllCutTypes}