const { User } = require('../models')

async function updateUserToken(userId, token) {
    const user = await User.where({
        'id': userId
    }).fetch({
        'require':false
    });
    user.set('token', token);
    await user.save();
}

async function getUserToken(userId) {
    const user = await User.where({
        'id': userId
    }).fetch({
        'require':false
    });
    
    return  user.get('token');
}

module.exports = { updateUserToken, getUserToken }