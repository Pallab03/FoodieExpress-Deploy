import { text } from "express";
import mongoose from "mongoose";

const { Schema } = mongoose;

const shopOrderItemSchema = new Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
    },
    name: String,
    price: Number,
    quantity: Number
}, { timestamps: true })

const ShopOrderSchema = new Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema],
    status: {
        type: String,
        enum: ["pending", "preparing", "out of delivery", "delivered"],
        default: "pending"
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        dafault: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    deliveryOtp: {
        type: String,
        default:null

    },
    otpExpires: {
        type: Date,
        default:null
    },
    deliveredAt:{
        type: Date,
        default:null
    }



}, { timestamps: true })



const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shopOrders: [ShopOrderSchema],
    payment:{
        type:Boolean,
        default:false
    },
    razorpayOrdertId:{
        type:String,
        dafault:""
    },
    razorpayPaymentId:{
        type:String,
        default:""
    }
}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
export default Order