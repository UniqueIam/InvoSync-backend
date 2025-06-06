const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');

exports.addAdmin = async(req,res) =>{
    const { adminName, adminEmail, adminPassword } = req.body;
    try {
        if(!adminName || !adminEmail || !adminPassword){
            return res.status(400).json({
                message: 'Admin name, email, and password are required'
            });
        }
        // Check if admin already exists
        const adminExists = await Admin.find({ adminEmail })
        console.log('adminExists', adminExists);
        if(adminExists.length > 0){
            return res.status(409).json({
                message: 'Admin already exists'
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        // Create new admin
        const newAdmin = await Admin.create({
            adminName,
            adminEmail,
            password: hashedPassword,
            role:1
        });
        await newAdmin.save();
        return res.status(201).json({
            success: true,
            message: 'Admin added successfully',
            admin: newAdmin
        });
    } catch (error) {
        console.log('Failed to add new admin', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}