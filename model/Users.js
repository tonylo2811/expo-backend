const mongoose = require('mongoose');
const { STRING_REQUIRED_TRIM, STRING, NUMBER, REF_OBJECT_ID, REF_OBJECT_ID_REQUIRED,OBJECTID } = require('./SchemaType');

const userSchema = new mongoose.Schema({
    username: STRING,
    password: STRING,
    email: STRING,
},{collection: 'user'})

const User = mongoose.model('user', userSchema);

module.exports = User;