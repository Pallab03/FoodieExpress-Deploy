import mongoose from "mongoose"


const connectDb= async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect to Databse");
        
    } catch (error) {
        console.log("error to connect Db",error);
    }
}

export default connectDb;