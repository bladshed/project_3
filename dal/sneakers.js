const { Sneaker } = require('../models')

async function getAllSneakers() {
    // when using the model as a class, we are referring
    // to the entire table
    let sneakers = await Sneaker.fetchAll();
    return sneakers;
}

module.exports = { getAllSneakers}