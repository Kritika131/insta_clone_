import mongoose from "mongoose";
const connectDB = async()=>{
    try{

        // console.log("db=",process.env.MONGO_URI)

        await mongoose.connect(process.env.MONGO_URI    );
       console.log("db connected successfully")

    }catch(err){

        console.log("error---",err)

    }
}

export default connectDB