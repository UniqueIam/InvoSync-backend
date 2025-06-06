const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Company = require('../models/companyModel');

exports.registerCompany = async(req,res) =>{
    const { companyName,companyEmail,password,companyId,companyLocation,companySite } = req.body;
    try {
        if(!companyName || !companyEmail || !companyId || !password) {
            return res.status(400).json({ message: 'Please fill all the fields  of the company' });
        }

        //check if company already exists
        const company = await Company.findOne({ companyId });
        if(company){
            return res.status(409).json({
                message: 'Company already exists'
            })
        }

        //hashing the password
        const hashedpassword = await bcrypt.hash(password, 10);
        //create new company
        const newCompany = await Company.create({
            companyName,
            companyEmail,
            password:hashedpassword,
            companyId,
            companyLocation,
            companySite,
            role: 2
        })

        await newCompany.save();
        
        return res.status(201).json({
            success:true,
            message:'Company registered successfully',
            company:newCompany
        })
    } catch (error) {
        console.log('failed to register new company',error);
        return res.status(500).json(error.message);
    }
}

exports.adminLogin = async(req,res) =>{
    const { email,password } = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                message:'Email, password are required to login'
            })
        }
        const admin = await Admin.findOne({ adminEmail: email });
        if(!admin){
            return res.status(404).json({
                message:'Admin not found'
            })
        }
        //compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message:'Invalid password'
            })
        }

        //generate jwt token
        const token = jwt.sign(
            {
                id: admin._id,
                name: admin.adminName,
                email: admin.adminEmail,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        //login successful
        return res.status(200).json({
            success:true,
            message:'Admin logged in successfully',
            token
        });

    } catch (error) {
        console.log('failed to login user',error);
        return res.status(500).json(error.message);
        
    }
}

exports.companyLogin = async(req,res) =>{
    const { email, password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({
                message:'Company email and password are required to login'
            })
        }
        const company = await Company.findOne({ companyEmail: email });
        if(!company){
            return res.status(404).json({
                message:'Company not found'
            })
        }
        //compare password
        const isPasswordMatched = await bcrypt.compare(password, company.password);
        if(!isPasswordMatched){
            return res.status(401).json({
                message:'Invalid password'
            })
        }
        //generate jwt token
        const token = jwt.sign(
            {
                id: company._id,
                companyId: company.companyId,
                name: company.companyName,
                email: company.companyEmail,
                createdAt:company.createdAt,
                role: company.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success:true,
            message:'Company logged in successfully',
            token
        });
    } catch (error) {
        console.log('failed to login company',error);
        return res.status(500).json(error.message);
    }
}

exports.editCompanyDetails = async(req,res) =>{
    //get the company id from the token
    const token = req.headers.authorization;
    // console.log("token",token);
    const companyId = req.user.companyId;
    // console.log("companyId:",companyId);
    const { companyName,email } = req.body; 
    try {
        if(!companyName || !email){
            return res.status(500).json({
                message:'All fields are required to update company details'
            })
        }
        const company = await Company.findOneAndUpdate(
            { companyId: companyId },
            { 
                companyName: companyName, 
                companyEmail: email 
            },
            { new: true }
        );
        await company.save();
        return res.status(200).json({
            message:'Company details updated successfully'
        })
    } catch (error) {
        console.log("failed to update the details");
        return res.status(500).json(error.message);
    }
}