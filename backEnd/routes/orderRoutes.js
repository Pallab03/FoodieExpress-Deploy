import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignMen,
     getMyOreders, getOrderById, getTodayDeliveries, placeOredr, sendDeliveryOtp, updateOrderStatus, 
     verifyDeliveryOtp,
     verifyPayment} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place-order",isAuth,placeOredr)
orderRouter.post("/verify-paymet",isAuth,verifyPayment)
orderRouter.get("/my-orders",isAuth,getMyOreders)
orderRouter.get("/get-assignments",isAuth,getDeliveryBoyAssignMen)
orderRouter.get("/get-current-order",isAuth,getCurrentOrder)
orderRouter.post("/send-delivery-otp",isAuth,sendDeliveryOtp)
orderRouter.post("/send-verify-otp",isAuth,verifyDeliveryOtp)
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRouter.get("/accepet-order/:assignmentId",isAuth,acceptOrder)
orderRouter.get("/get-order-by-id/:orderId",isAuth,getOrderById)
orderRouter.get("/get-today-deliveries",isAuth,getTodayDeliveries)



export default orderRouter