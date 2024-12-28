const express = require('express')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const vendorRoutes = require('./routes/vendorRoutes')
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes')
const path = require('path')



const app =express();
dotenv.config();
app.use(bodyparser.json())
const PORT=5000;

const DB=mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('DB connected');  }).catch((error)=>{console.log(error)})


app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes); 
app.use('/uploads',express.static('uploads'));


app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`);
    DB;
    
})