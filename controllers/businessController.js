const Business = require('../models/businessModel');
const Company = require('../models/companyModel');
const { companyLogin } = require('./authController');

exports.addBusiness = async (req, res) => {
  const id = req.user.id;

  const {
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
    website,
    email,
  } = req.body;

  try {
    // Basic validation
    if (
      !name ||
      !cin ||
      !gstin ||
      !address1 ||
      !postalCode ||
      !city ||
      !state ||
      !country ||
      !phoneNumber ||
      !email
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get company document by ID
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check for duplicate business name
    const existing = company.business.find((item) => item.name === name);
    if (existing) {
      return res.status(400).json({ message: "Business already exists" });
    }


    // New business object
    const newBusiness = {
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
      website,
      email
    };

    await Company.findByIdAndUpdate(
        id,
        {$push:{business:newBusiness}},
        {new:true}
    );
    return res.status(201).json({ message: "Business added successfully" });
  } catch (error) {
    console.error("Error adding business:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editBusiness = async (req, res) => {
  const companyId = req.user.id;
  const { companyName } = req.params;
  console.log("Company Name",companyName);
  const {
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
    email,
    website
  } = req.body;

  try {
    // Construct the updated business object
    const updatedBusiness = {
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
      email,
      website
    };

    // Use positional operator to update only the matched business
    const result = await Company.updateOne(
      { _id: companyId, "business.name": companyName },  // Find company and business by name
      {
        $set: {
          "business.$": updatedBusiness  // Replace matched business object
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json({ message: "Business updated successfully" });
  } catch (error) {
    console.error("Failed to update business:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


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