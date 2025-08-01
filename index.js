const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const dbConnection = require('./db/dbConfig');
const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const clientRoute = require('./routes/clientRoute');
const productRoute = require('./routes/productRoute');
const businessRoute = require('./routes/businessRoute');

dotenv.config({});
const app = express();

const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://invo-sync-frontend-giet.vercel.app', // production frontend
  'https://invo-sync-frontend-giet.vercel.app/login'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//database connection
dbConnection();

//routes
app.use('/api',adminRoute);
app.use('/auth',authRoute);
app.use('/api',invoiceRoute);
app.use('/api',clientRoute);
app.use('/api',productRoute);
app.use('/api',businessRoute);

app.get('/',(req,res)=>{
    res.send('Hello from contaSphere');
})

PORT = process.env.PORT || 8083;
app.listen(PORT,()=>{
    console.log(`Server is running at the port ${PORT}`);
    return;
})