const {Schema, model} = require('mongoose');

const Profile = Schema({
    id: String,
    age: Number,
    country: String
});

module.exports = model('Profile',Profile);