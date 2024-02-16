const mongoose = require('mongoose');
const { STRING_REQUIRED_TRIM, STRING, NUMBER, REF_OBJECT_ID, REF_OBJECT_ID_REQUIRED } = require('./SchemaType');

const garmentSchema = new mongoose.Schema({
    owner: STRING,
    categories: STRING,
    season: [STRING],
    occasion: [STRING],
    size: STRING,
    colour: [STRING],
    brand: STRING,
    price: NUMBER,
    remarks: STRING,
    labels: [STRING],
    image: STRING
},{collection: 'garment'})

const Garment = mongoose.model('garment', garmentSchema);

module.exports = Garment;