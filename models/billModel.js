const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    cin:{
        type:String,
    },
    gstin:{
        type:String,
    },
    address1:{
        type:String,
        required:true
    },
    address2:{
        type:String,
    },
    postalCode:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
    },
    email:{
        type:String,
    },
})

const Bill = mongoose.model('Bill',billSchema);

module.exports = Bill;
