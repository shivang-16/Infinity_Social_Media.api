import mongoose from "mongoose";

let MongoURI ='mongodb://127.0.0.1:27017'

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