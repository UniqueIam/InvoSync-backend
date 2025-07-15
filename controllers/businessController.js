const Business = require('../models/businessModel');
const Company = require('../models/companyModel');

exports.addBusiness = async(req,res) =>{
    // const companyId = req.user.companyId;
    const {
        name,
        cin,
        gstin,
        addressLine1,
        addressLine2,
        postalCode,
        city,
        state,
        country,
        phoneNumber,
        website,
        email,
        company_id
    } = req.body;
    try {
        if(!name || !cin || !gstin || !addressLine1 || !postalCode || !city || !state || !country || !phoneNumber || !email || !company_id) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //check  is the business already exists or not
        const business = await Business.findOne({
            $or:[
                {email},
                {gstin}
            ]
        })
        if (business) {
            return res.status(400).json({ message: "Business already exists" });
        }
        //create a new business
        const newBusiness = new Business({
            name,
            cin,
            gstin,
            address:addressLine1,
            address2:addressLine2,
            postalCode,
            city,
            state,
            country,
            phoneNumber,
            website,
            email,
        })
        await newBusiness.save();
        return res.status(200).json({
            success: true,
            message: "Business added successfully",
            business: newBusiness
        })
    } catch (error) {
        console.error("Error adding business:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.editBusiness = async(req,res) =>{
    const {
        name,
        cin,
        gstin,
        address1,
        addressLine2,
        postalCode,
        city,
        state,
        country,
        phoneNumber,
        email,
        website
    } = req.body;
    try {
        
    } catch (error) {
        console.log('failed to edit the business',error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}

exports.showAllBusiness = async(req,res) =>{
    const {id} = req.user;
    console.log("Database id:",id);
    try {
        if(!id){
            return res.status(409).json({
                message:'Database Id is requried'
            })
        }
        
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({
                message:'Company not found'
            })
        }
        return res.status(200).json({
            message:'Successfully fetched business data',
            business:company.business
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}