const path = require('path');
const fs = require('fs');
const cloudinary = require('../services/cloudinary');
const Bill = require('../models/billModel');
const Invoice = require('../models/invoiceModel');

exports.createBill = async(req,res) =>{
    const { name,cin,gstin,address1,address2,postalCode,city,state,country,phoneNumber,email } = req.body;
    try {
        if(!name || !address1 || !postalCode || !city || !state ||!country){
            return res.status(400).json({
                message:'These fields are required'
            })
        }
        //create new bill
        const newBill = await Bill.create({
            name,
            cin,
            gstin,
            address1,
            address2,
            postalCode,
            city,
            state,
            country,
            phoneNumber,
            email
        })
        await newBill.save();
        return res.status(200).json({
            message:'Bill has created successfully'
        })
    } catch (error) {
        console.log('failed to create the bill',error);
        return res.status(500).json(error.message);
    }
}

exports.createInvoice = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const {
    logo,
    billTo,
    invoiceDescription,
    invoiceDetails,
    products,
    paymentMethod
  } = req.body;

  try {
    // Validate required fields
    if (!billTo || !products || !invoiceDetails) {
      return res.status(400).json({ message: "Missing required invoice fields." });
    }

    // Parse JSON strings if they are strings
    let parsedBillTo = typeof billTo === 'string' ? JSON.parse(billTo) : billTo;
    let parsedInvoiceDetails = typeof invoiceDetails === 'string' ? JSON.parse(invoiceDetails) : invoiceDetails;
    let parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
    let parsedPaymentMethod = typeof paymentMethod === 'string' ? JSON.parse(paymentMethod) : paymentMethod;

    let invoiceDescriptionString = typeof invoiceDescription === 'string'
      ? invoiceDescription
      : JSON.stringify(invoiceDescription);

    // Optional: Save logo file if it's uploaded as a multipart/form-data
    let logoPath = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path,{
        folder:'uploads/logos',
        public_id:`logo-${Date.now()}`,
        resource_type:'image'
      })
      logoPath = result.secure_url;
      console.log("logopath:",logoPath);

       // Delete the local file
      fs.unlinkSync(req.file.path);
    }

    // Construct your invoice object
    const invoiceData = {
      logo: logoPath,
      billTo: parsedBillTo,
      invoiceDescription: invoiceDescriptionString,
      invoiceDetails: parsedInvoiceDetails,
      products: parsedProducts,
      paymentMethod: parsedPaymentMethod,
      createdAt: new Date()
    };
    console.log("Invoice Object:",invoiceData)
    // Save to DB
    const createdInvoice = await Invoice.create(invoiceData);

    return res.status(201).json({
      message: "Invoice created successfully.",
      invoice: createdInvoice
    });
  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ 
      message: "Internal server error" ,
      error:error.message
    });
  }
};
