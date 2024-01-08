const mongoose = require('mongoose');
const SchemaType = mongoose.Schema.Types;

//add object, boolean, array, date?
module.exports = {
    STRING:{
        type: String
    },
    STRING_REQUIRED:{
        type: String,
        required: true
    },
    STRING_REQUIRED_TRIM:{
        type: String,
        required: true,
        trim: true
    },
    NUMBER:{
        type: Number,
        default: 0
    },
    NUMBER_REQUIRED:{
        type: Number,
        required: true
    },
    REF_OBJECT_ID: (ref) => {
        return {
            type: SchemaTypes.ObjectId,
            ref
        }
    },
    REF_OBJECT_ID_REQUIRED: (ref) => {
        return {
            type: SchemaTypes.ObjectId,
            ref,
            required: true
        }
    }
}