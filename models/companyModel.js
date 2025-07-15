const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyLogo:{
        type:String,
        required:true
    },
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
    companyLocation:{
        type:String,
        default:null,
    },
    companySite:{
        type:String,
        default:null
    },
    business:{
    type: [
        {
        name:{type:String,required:true},
        cin:{type:String, required:true},
        gstin:{type:String, required:true},
        address1:{type:String},
        address2:{type:String},
        postalCode:{type:String, required:true},
        city:{type:String, required:true},
        state:{type:String, required:true},
        country:{type:String,required:true},
        phoneNumber:{type:String},
        email:{type:String},
        website:{type:String}
        }
    ],
    default: []
    },
    products:{
        type:[
            {
                productNumber:{type:String},
                productName:{type:String,required:true},
                unitPrice:{type:Number,required:true},
                quantity:{type:Number},
                discount:{type:String},
                taxCode:{type:String,required:true},
                gst:{type:String}

            }
        ],
        default:[]
    },
    role:{
        type:Number,
        default:2 // 1 for admin, 2 for company
    }
},{timestamp:true})

const Company = mongoose.model("Company",companySchema);

module.exports = Company;