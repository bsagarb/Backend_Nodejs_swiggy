const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.SECRET_KEY;




const vendorRegister = async(req,res)=>{
    const {username,email,password}=req.body;
 try{
    const vendorEmail=await Vendor.findOne({email});
    if(vendorEmail){
        return res.status(400).json("Email already exist")
    }

    const hashPassword=await bcrypt.hash(password,10);
    const newVendor = new Vendor({
        username,
        email,
        password:hashPassword
    });

    await newVendor.save();

    res.status(201).json({message:"Vendor successfully registered"})
    console.log('registered');
}catch(error){
    res.status(500).json({error:"internal server error"})
    console.log(error);
    
}

}

const vendorLogin = async(req,res)=>{
    const {email,password}=req.body;

    try{
        const vendor = await Vendor.findOne({email})

        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"inavlid username or password"})
        }

        const token = jwt.sign({VendorId:vendor._id},secretKey,{expiresIn: "1hr"})

        res.status(200).json({success:"Login successful",token})
        console.log(email);
        

    }catch(error){
        res.status(500).json({error:"internal server error"})
        console.log(error);
    }

}

const getAllVendors = async (req,res) => {
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});

    }catch(error){
        res.status(500).json({error:"internal server error"})
        console.log(error);
    }
}

const getVendorById= async(req,res)=>{
    const vendorId = req.params.id;

    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');

        if(!vendor){
            return res.status(401).json({message: "vendor not found"})
        }

        res.status(200).json({vendor})

    }catch{
        res.status(500).json({error:"internal server error"})
        console.log(error);
    }
}



module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById}