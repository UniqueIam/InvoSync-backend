const mongoose = require('mongoose');

const dbConnection = async(req,res) =>{
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        
    } catch (error) {
        console.log('failed to connect to MongoDb',error);
        process.exit(1);
    }
}

module.exports = dbConnection;