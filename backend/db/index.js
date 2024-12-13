import mongoose from "mongoose";

export const connectToDb=()=>{
    mongoose.connect(process.env.MONGODB_URL,{dbName:"hackathon"}).then(()=>{
        console.log("MongoDb connected Succesfully");
        
    })
}
export const disconnectFromDb = async () => {
    try {
        await mongoose.connection.close();
        console.log("Database connection closed successfully");
    } catch (error) {
        console.error("Error disconnecting from the database:", error);
        throw error;
    }
};