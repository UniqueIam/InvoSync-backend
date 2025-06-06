const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    addressline1:{
        type:String,
        required:true,
    },
    addressline2:{
        type:String,
    },
    cin:{
        type:String,
    },
    gstin:{
        type:String,
    },
    email:{
        type:String,
    },
    postalCode:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    cc:{
        type:String,
    },
    city:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
    },
    fixedDiscount:{
        type:String,
    },
    totalInvoice:{
        type:Number,
        default:0
    },
    company_id:{
        type:String,
        required:true
    }
})

const Client = mongoose.model('Client',clientSchema);

module.exports = Client;