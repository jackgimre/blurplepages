const {Schema, model} = require('mongoose');

const Profile = Schema({
    id: String,
    age: Number,
    country: String,
    qCountry: Array,
    qAge: Array,
    bio: String
});

module.exports = model('Profile',Profile);