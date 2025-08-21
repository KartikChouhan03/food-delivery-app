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
        // Create Razorpay Order first
        const options = {
            amount: (req.body.amount + 59) * 100, // amount in paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Return order details without saving to database yet
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            newOrderId: null, // Will be created after payment verification
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
            // Create order only after successful payment
            const newOrder = new orderModel({
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                payment: true
            });

            await newOrder.save();
            await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
            
            res.json({success:true,message:"Paid"})
        }
        else{
            // Payment failed, don't create order
            res.json({success:false,message:"not paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}


export {placeOrder ,verifyOrder};
