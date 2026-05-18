//connect project to mongodb

import mongoose from "mongoose";

const connectDB =async()=>{
 try{
   await mongoose.connect(process.env.MONGODB_URI);
   console.log("Database Connected");
 }catch(error){
    console.log("DB connection failed:", error.message);
    process.exit(1); // ❗ server stop
 }
}

export default connectDB;