const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  logo: String,
  billTo: {
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
    email: String
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
  products: {
      productName: String,
      quantity: Number,
      unitPrice: Number,
      discount:Number,
      taxCode: String,
      netAmount:String
    },
  paymentMethod: {
    bankAccountName:String,
    bankName: String,
    bankAccountNumber: String,
    ifsc: String,
    swift: String
  },
},{timestamps:true});

module.exports = mongoose.model('Invoice', invoiceSchema);
