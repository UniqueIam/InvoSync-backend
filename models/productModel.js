const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productNumber:{
        type:String,
    },
    productName:{
        type:String,
        required:true,
    },
    unitPrice:{
        type:Number,
        required:true,
    },
    taxCode:{
        type:String,
        required:true,
    },
    gst:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:'Company'
    }

})

const Product = mongoose.model('Product',productSchema);

module.exports = Product;