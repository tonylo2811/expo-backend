//option 1: one model for all
//option 2: one for users, one for clothes&tags

const mongoose = require('mongoose');
const { STRING_REQUIRED_TRIM, STRING, NUMBER, REF_OBJECT_ID, REF_OBJECT_ID_REQUIRED } = require('./SchemaType');

const userSchema = new mongoose.Schema({
    username: STRING_REQUIRED_TRIM,
    password: STRING_REQUIRED_TRIM,
    email: STRING_REQUIRED_TRIM,
    //add clothes, tags
})

const User = mongoose.model('user', userSchema); //collection name in DB********, schema

module.exports = User;