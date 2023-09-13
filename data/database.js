import mongoose from "mongoose";

let MongoURI = process.env.MONGO_URI;

export const connectToDB = async()=>{
    try {
        await mongoose.connect(MongoURI,{
            dbName:'Social_Media_App'
        })
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
}