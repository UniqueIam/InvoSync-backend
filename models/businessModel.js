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
    address:{
        type:String,
        required:true,
    },
    address2:{
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
    createdBy:{
        type:mongoose.Schema.ObjectId,        //company database Id
        ref:'Company'
      }
},{timestamps:true});

const Business = mongoose.model('Business',businessSchema);

module.exports = Business;