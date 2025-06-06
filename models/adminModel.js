const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    adminEmail: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:Number,
        default:1
    }
}, { timestamps: true });   

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;