const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm')
const path = require('path');



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


const addProduct = async (req,res)=>{
    try{
     const {productName,price,category,bestSeller,description} = req.body;     
      const image = req.file ? req.file.filename : undefined;

      const firmId = req.params.firmId;
      const firm = await Firm.findById(firmId);

      if(!firm){
        return res.status(400).json({error:"No firm found"})
    }
   
    const product = new Product({
        productName,price,category,bestSeller,description,image,firm:firm._id
    })

    const saveProduct = await product.save();
     firm.products.push(saveProduct)
      await firm.save()
      

    return res.status(200).json(saveProduct);


    }catch(error){
        res.status(500).json({error:"internal server error in product validation"})
        console.log(error);
    }
 
    
}


const getProductByFirm = async(req,res)=>{
    try{
     const firmId = req.params.firmId;
     const firm = await Firm.findById(firmId);
     if(!firm){
        return res.status(400).json({error:"No firm found"})
     }
     const restaurantName = firm.firmName;
     const products = await Product.find({firm:firmId})
     res.status(200).json({restaurantName,products})
    }catch(error){
        res.status(500).json({error:"internal server error in product validation"})
        console.log(error);
    }
}

const deleteProductById = async(req,res)=>{
    try{
        const prodctId = req.params.productId;
        const  deleteProduct = await Product.findByIdAndDelete(prodctId)

        if(!deleteProduct){
            return res.status(400).json({error: "no product found"})
        }

        res.status(200).json({message:"product deleted succesfully"})


    }catch(error){
        res.status(500).json({error:"internal server error in product validation"})
        console.log(error);
    }
}


module.exports={addProduct :[upload.single('image'),addProduct],getProductByFirm,deleteProductById};