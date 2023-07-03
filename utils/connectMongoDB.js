import mongoose from "mongoose";

const connectDB = async ()=> {
    const connectionParams = {
        useUnifiedTopology: true,
    }
    try{
        mongoose.set('strictQuery', false)
        mongoose.connect("mongodb+srv://DeathG7n:if3anYichukwu@cluster0.gpfyqmb.mongodb.net/?retryWrites=true&w=majority", connectionParams)
        //mongoose.connect("mongodb://localhost:27017/test", connectionParams)
        console.log('Database Connected')
    } catch(err){
        console.log(err)
        console.log('Database not connected')
    }
}
export default connectDB