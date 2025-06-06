const Business = require('../models/businessModel');

exports.addBusiness = async(req,res) =>{
    const companyId = req.user.companyId;
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
                {name},
                {cin}
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
            addressLine1,
            addressLine2,
            postalCode,
            city,
            state,
            country,
            phoneNumber,
            website,
            email,
            company_id,
            company_id:companyId
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
    try {
        
    } catch (error) {
        console.log('failed to edit the business',error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
}