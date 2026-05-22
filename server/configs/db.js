//connect project to mongodb
import mongoose from "mongoose";

const connectDB = async () => {
 try {
   // options mein dbName daal diya hai taaki sahi database connect ho
   await mongoose.connect(process.env.MONGODB_URI, {
     dbName: "test"
   });
   console.log("Database Connected to hotel-booking");
 } catch (error) {
    console.log("DB connection failed:", error.message);
    process.exit(1); // ❗ server stop
 }
}

export default connectDB;