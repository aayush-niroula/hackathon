import mongoose from "mongoose";

export const connectToDb=()=>{
    mongoose.connect(process.env.MONGODB_URL,{dbName:"hackathon"}).then(()=>{
        console.log("MongoDb connected Succesfully");
        
    })
}
