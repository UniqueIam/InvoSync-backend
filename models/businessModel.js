const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    cin:{
        type:String,
        required:true,
    },
    gstin:{
        type:String,
        required:true,
    },
    addressLine1:{
        type:String,
        required:true,
    },
    addressLine2:{
        type:String,
    },
    postalCode:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    website:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    company_id:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Business = mongoose.model('Business',businessSchema);

module.exports = Business;