const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");

exports.addClient = async(req,res) =>{
    const {id} = req.user;
    const { 
        name,
        address1,
        address2,
        cin,
        gstin,
        email,
        postalCode,
        state,
        cc,
        city,
        country,
        phoneNumber,
        fixedDiscount } = req.body;

    try {
        if(!name || !address1 || !postalCode || !state || !city || !country) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const existingClient = await Client.findOne({
            $and:[
                {name:name},
                {email:email}
            ]
        })
        if(existingClient){
            //increase the number of invoice only
            existingClient.totalInvoice = (existingClient.totalInvoice || 0)+ 1;
            await existingClient.save();

            return res.status(202).json({
                message: 'Client already exists'
            })
        }
        //create new client
        const newClient = await Client.create({
            name,
            addressline1:address1,
            addressline2:address2,
            cin,
            gstin,
            email,
            postalCode,
            state,
            cc,
            city,
            country,
            phoneNumber,
            fixedDiscount,
            createdBy:id
        })

        await newClient.save();
        return res.status(201).json({
            success:true,
            message:'Client added successfully',
        })
    } catch (error) {
        console.log('failed to add new client',error);
        return res.status(500).json(error.message);
    }
}

exports.getAllClients = async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);

  try {
    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized access',
      });
    }

    // ✅ Aggregation to get unique clients by name created by the current user
    const clients = await Client.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: "$name", // group by client name
          doc: { $first: "$$ROOT" } // pick the first document for each name
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" } // flatten the result
      }
    ]);

    if (!clients || clients.length === 0) {
      return res.status(404).json({
        message: 'No distinct clients found for this user.',
        clients: [],
      });
    }

    return res.status(200).json({
      message: 'Distinct clients retrieved successfully',
      clients,
    });

  } catch (error) {
    console.error("Error retrieving clients:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getClientByName = async(req,res) =>{
    const { name } = req.params;
    try {
        if(!name) {
            return res.status(400).json({ message: 'Please provide a name' });
        }
        const client = await Client.findOne({ name})
        if(!client){
            return res.status(404).json({
                message: 'Client not found'
            })
        }
        return res.status(200).json({
            success:true,
            client
        })
    } catch (error) {
        console.log('failed to get client by name',error);
        return res.status(500).json(error.message);
    }
}