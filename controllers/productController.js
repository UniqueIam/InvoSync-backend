const Product = require('../models/productModel');

exports.createProduct = async(req,res) =>{
    const token = req.headers.authorization;
    const companyId = req.user.companyId;
    const {
        productNumber,
        productName,
        unitPrice,
        taxCode,
        gst
    } = req.body;
    try {
        if(!productName || !unitPrice || !taxCode || !gst){
            return res.status(400).json({
                message: 'Please fill all the fields'
            })
        }
        //create product
        const newProduct = await Product.create({
            productNumber,
            productName,
            unitPrice,
            taxCode,
            gst,
            company_id:companyId
        })
        await newProduct.save();
        return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        })
    } catch (error) {
        console.log('failed to create product',error);
        res.status(500).json({
            message: 'failed to create product',
            error: error.message
        })
    }
}

exports.getAllProducts = async (req, res) => {
    const token = req.headers.authorization;
    const companyId = req.user.companyId;

    try {
        // Get all products for this company
        const products = await Product.find({ company_id: companyId });

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found for this company',
            });
        }

        return res.status(200).json({
            message: 'Products found',
            products: products,
        });
    } catch (error) {
        console.error('failed to get all products', error);
        return res.status(500).json({
            message: 'failed to get all products',
            error: error.message,
        });
    }
};


exports.getProductByName = async(req,res) =>{
    const { productName } = req.params;
    try {
        if(!productName){
            return res.status(400).json({
                message: 'Please provide a product name'
            })
        }   
        //get product by name
        const product = await Product.findOne({productName: productName});
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        return res.status(200).json({
            message: 'Product found',
            product: product
        })
    } catch (error) {
        console.log('failed to get product by name',error);
        res.status(500).json({
            message: 'failed to get product by name',
            error: error.message
        })    
    }
}