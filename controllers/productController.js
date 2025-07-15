const Product = require("../models/productModel");
const Company = require("../models/companyModel");

exports.createProduct = async (req, res) => {
  const { id } = req.user;
  console.log("Id:", id);
  const { productNumber, productName, unitPrice, taxCode, gst } = req.body;
  try {
    if (!productName || !unitPrice || !taxCode || !gst) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    //create product
    const productData = {
      productNumber,
      productName,
      unitPrice,
      taxCode,
      gst,
    };
    await Company.findByIdAndUpdate(
      id,
      { $push: { products: productData } },
      { new: true }
    );

    return res.status(200).json({
      message: "Product created successfully",
    });
  } catch (error) {
    console.log("failed to create product", error);
    res.status(500).json({
      message: "failed to create product",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const { id } = req.user;

  try {
    // Get all products for this company
    if(!id){
        return res.status(409).json({
            message:'Database id is required'
        })
    }

    const company = await Company.findById(id);

    if(!company){
        return res.status(404).json({
            message:'Comapany not registered,Please create account first'
        })
    }

    return res.status(200).json({
      message: "Products found",
      products: company.products,
    });
  } catch (error) {
    console.error("failed to get all products", error);
    return res.status(500).json({
      message: "failed to get all products",
      error: error.message,
    });
  }
};

exports.getProductByName = async (req, res) => {
  const { productName } = req.params;
  try {
    if (!productName) {
      return res.status(400).json({
        message: "Please provide a product name",
      });
    }
    //get product by name
    const product = await Product.findOne({ productName: productName });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Product found",
      product: product,
    });
  } catch (error) {
    console.log("failed to get product by name", error);
    res.status(500).json({
      message: "failed to get product by name",
      error: error.message,
    });
  }
};
