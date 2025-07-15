const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const cloudinary = require('../services/cloudinary');
const Bill = require('../models/billModel');
const Invoice = require('../models/invoiceModel');
const Company = require('../models/companyModel');


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
  const { id } = req.user;
  console.log("Client database id:",id);
  // console.log('Request body:', req.body);
  // console.log('Uploaded file:', req.file);

  const {
    billTo,
    billFrom,
    invoiceDescription,
    invoiceDetails,
    products,
    paymentMethod
  } = req.body;

  console.log("Invoice Body from frontend:",req.body);
  try {
    // Validate required fields
    if (!billTo || !billFrom || !products || !invoiceDetails) {
      return res.status(400).json({ message: "Missing required invoice fields." });
    }

    // Parse JSON strings if they are strings
    let parsedBillTo = typeof billTo === 'string' ? JSON.parse(billTo) : billTo;
    let parsedBillFrom = typeof billFrom === 'string' ? JSON.parse(billFrom):billFrom;
    let parsedInvoiceDetails = typeof invoiceDetails === 'string' ? JSON.parse(invoiceDetails) : invoiceDetails;
    let parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
    if(!Array.isArray(parsedProducts)){
      parsedProducts=[parsedProducts]
    }
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
      billTo: parsedBillTo,
      billFrom:parsedBillFrom,
      invoiceDescription: invoiceDescriptionString,
      invoiceDetails: parsedInvoiceDetails,
      products: parsedProducts,
      paymentMethod: parsedPaymentMethod,
      createdBy:id,
      createdAt: new Date()
    };
    console.log("Invoice Object:",invoiceData)
    // Save to DB
    const createdInvoice = await Invoice.create(invoiceData);
     await Company.findByIdAndUpdate(
      id,
      { $push: {business:parsedBillFrom } },
      { new: true }
    );
    await Company.findByIdAndUpdate(
      id,
      { $push: {products:parsedProducts}},
      { new: true }
    ) 

    const templatePath = path.join(__dirname, '../views/invoiceTemplate.ejs')
    const html = await ejs.renderFile(templatePath,{
      billTo: parsedBillTo,
      billFrom: parsedBillFrom,
      invoiceDetails: parsedInvoiceDetails,
      products: parsedProducts,
      paymentMethod: parsedPaymentMethod,
      logo: logoPath
    })
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px' }
    });

    await browser.close();

    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': `attachment; filename=invoice-${createdInvoice._id}.pdf`,
    //   'Content-Length': pdfBuffer.length
    // });

    // return res.send(pdfBuffer);

    const pdfBase64 = pdfBuffer.toString('base64');
    return res.status(201).json({
  message: "Invoice created successfully.",
  invoice: createdInvoice,
  pdf: pdfBase64  // ✅ send proper Base64
});
  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ 
      message: "Internal server error" ,
      error:error.message
    });
  }
};


exports.getAllInvoices = async(req,res) =>{
  const {id} = req.user;
  console.log("Id:",id);
  try {
      if(!id){
        return res.status(409).json({
          message:'Company database Id is required'
        })
      }
      const invoices = await Invoice.find({createdBy:id});
      return res.status(200).json({
        message:'Invocies',
        invoices
      })
  } catch (error) {
    console.log('failed to get the invoices');
    return res.status(500).json(error.message);
  }
}

exports.getAllInvoicesByDate = async (req, res) => {
  const { id } = req.user;
  const { date } = req.query;

  console.log("Date from frontend:", date);

  try {
    if (!date) {
      return res.status(409).json({ message: 'Date is required' });
    }

    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const nextDate = new Date(inputDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const invoices = await Invoice.find({
      createdBy: id,
      'invoiceDetails.invoiceDate': {
        $gte: inputDate,
        $lt: nextDate
      }
    });

    res.status(200).json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices by date:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.shouldShowLogoUpload = async (req, res) => {
  const { id } = req.user;
  console.log("Company database id:", id);

  try {
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const shouldShow = !company.logo || company.logo.length === 0;

    return res.status(200).json({
      showLogoUpload: shouldShow
    });

  } catch (error) {
    console.error("Error in shouldShowLogoUpload:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
