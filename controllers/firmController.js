const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
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


const addFirm=async(req,res)=>{

   try{

    const {firmName,area,category,region,offer}=req.body;

    if (!firmName || firmName.trim() === '') {
        return res.status(400).json({ message: "Firm name is required and cannot be empty" });
    }
   
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        return res.status(401).json({message:"Vendor not found"})
    }
    const existingFirm = await Firm.findOne({ firmName });
    if (existingFirm) {
        return res.status(400).json({ message: "Firm with this name already exists" });
    }
    const firm = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })
    
    const saveFirm=await firm.save();
    vendor.firm.push(saveFirm);
    await vendor.save();

    return res.status(200).json({message:"firm added succesfully"});

   }catch(error){
    res.status(500).json({error:"internal server error"})
    console.log(error);
   }

}


const deleteFirmById = async(req,res)=>{
    try{
        const firmId = req.params.firmId;
    
        
        const  deleteFirm = await Firm.findByIdAndDelete(firmId)

        if(!deleteFirm){
            return res.status(400).json({error: "no product Firm"})
        }

        res.status(200).json({message:"firm deleted succesfully"})

    }catch(error){
        res.status(500).json({error:"internal server error in product validation"})
        console.log(error);
    }
}

module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmById}