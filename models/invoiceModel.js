const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({ 
  billTo: {
    name: String,
    cin: String,
    gstin: String,
    address1: String,
    address2: String,
    postalCode: String,
    city: String,
    state: String,
    country: String,
    phoneNumber: String,
    email: String
  },
  billFrom:{
    name: String,
    cin: String,
    gstin: String,
    address: String,
    address2: String,
    postalCode: String,
    city: String,
    state: String,
    country: String,
    phoneNumber: String,
    email: String,
    website:String
  },
  invoiceDescription: {
    type: String,
    required: true
},
  invoiceDetails: {
    invoiceNumber: String,
    invoiceDate: Date,
    dueDate: Date
  },
  products: [
  {
      productName: String,
      quantity: Number,
      unitPrice: Number,
      discount:Number,
      taxCode: String,
      netAmount:String
    }
  ],
  paymentMethod: {
    bankAccountName:String,
    bankName: String,
    bankAccountNumber: String,
    ifsc: String,
    swift: String
  },
  createdBy:{
    type:mongoose.Schema.ObjectId,        //company database Id
    ref:'Company'
  }
},{timestamps:true});

const Invoice = mongoose.model('Invoice',invoiceSchema);


module.exports = Invoice;
