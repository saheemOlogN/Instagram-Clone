import mongoose from "mongoose"

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.URI)
        console.log("db connected");
        
    } catch (error) {
    console.log(error)
}
}
export default connectDb;