import mongoose from "mongoose";


export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv:chouhankartik3030:mongodb123@cluster0.phv4fia.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}