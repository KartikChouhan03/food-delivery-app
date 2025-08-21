import mongoose from "mongoose";


export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://chouhankartik3030:<db_password>@cluster0.phv4fia.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}