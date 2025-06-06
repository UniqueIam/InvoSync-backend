const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    companyEmail:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    companyId:{
        type:String,
        required:true
    },
    companyLocation:{
        type:String,
        default:null,
    },
    companySite:{
        type:String,
        default:null
    },
    role:{
        type:Number,
        default:2 // 1 for admin, 2 for company
    }
},{timestamp:true})

const Company = mongoose.model("Company",companySchema);

module.exports = Company;