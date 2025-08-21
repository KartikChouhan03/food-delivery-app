import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import { model } from "mongoose";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


//placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Create Razorpay Order
        const options = {
            amount: (req.body.amount + 59) * 100, // amount in paise
            currency: "INR",
            receipt: `order_rcptid_${newOrder._id}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            newOrderId: newOrder._id,
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Payment init failed" });
    }
}

const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
        
    }
}

//listing orders for admin panel
const listOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"error"});
    }
}


export {placeOrder ,verifyOrder,userOrders, listOrders};