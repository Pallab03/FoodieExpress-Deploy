import DeliveryAssignment from "../models/deliveryAssignment.js";
import Order from "../models/order.js";
import Shop from "../models/shop.js";
import User from "../models/userModel.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

export const placeOredr = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

        if (cartItems.length == 0 || !cartItems)
            return res.status(400).json({ messag: "Cart in Empty" })

        if (!paymentMethod || !deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude)
            return res.status(400).json({ messag: "Please Add Delivery Address Properly." })

        const groupItemsByShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop;
            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];
            }
            groupItemsByShop[shopId].push(item)

        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {
            const shop = await Shop.findById(shopId).populate('owner')

            if (!shop)
                return res.status(400).json({ messag: "Shop doesn't found." })
            const items = groupItemsByShop[shopId];
            // console.log(items)
            const subTotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)

            // console.log(subTotal)
            // console.log(shop)
            return {
                shop: shop._id,
                owner: shop.owner._id,
                subTotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity
                }))
            }

        }))


        if (paymentMethod == "online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `reciept_${Date.now()}`

            })

            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod,
                totalAmount,
                shopOrders,
                deliveryAddress,
                razorpayOrderId: razorOrder.id,
                payment: false

            })

            return res.status(200).json({
                razorOrder,
                orderId: newOrder._id
            })
        }



        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            totalAmount,
            shopOrders,
            deliveryAddress

        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")
        await newOrder.populate("shopOrders.owner", "fullName socketId")
        await newOrder.populate("user", "fullName email mobile socketId")


        const io = req.app.get('io')

        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {

                const ownerSocketId = shopOrder.owner.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress,
                        payment: newOrder.payment
                    })
                }
            });
        }

        return res.status(201).json(newOrder)


    } catch (error) {
        return res.status(500).json({ messag: `Error for placeOrder : ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if (!payment || payment.status != "captured") {
            res.status(200).json({ messag: "Payment not captured" })
        }

        const order = await Order.findById(orderId);

        if (!order)
            return res.status(400).json({ messag: "Order not Found" })

        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()



        await order.populate("shopOrders.shopOrderItems.item", "name image price")
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.owner", "fullName socketId")
        await order.populate("user", "fullName email mobile socketId")


        const io = req.app.get('io')

        if (io) {
            order.shopOrders.forEach(shopOrder => {

                const ownerSocketId = shopOrder.owner.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment
                    })
                }
            });
        }

        res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ messag: `Error for verify payment order  : ${error}` })

    }
}

export const getMyOreders = async (req, res) => {

    try {

        const user = await User.findById(req.userId)
        // console.log(user)
        // if (!user)
        //     return res.status(500).json({ message: "User is Not Found" })

        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            return res.status(200).json(orders)

        } else if (user.role == "owner") {
            // console.log("owner")
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

            const filteredOrders = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            })))

            // console.log(orders)

            return res.status(200).json(filteredOrders)
        }



    } catch (error) {
        return res.status(500).json({ messag: `Error for geting UserOrders : ${error}` })

    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId)
        const shopOrder = order.shopOrders.find(o => o.shop == shopId)

        if (!shopOrder)
            return res.status(400).json({ messag: "Shop Order not Found" })

        shopOrder.status = status;
        let deliveryBoysPayload = []

        if (status == "out of delivery" && !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },   //for getting delivery boys under the 5km
                        $maxDistance: 5000
                    }
                }
            })

            const nearByIds = nearByDeliveryBoys.map(b => b._id)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                staus: { $nin: ["brodcasted", "completed"] }
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(id => String(id)))

            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))


            const candidates = availableBoys.map(b => b._id)

            if (candidates.length == 0) {
                await order.save()
                return res.json({
                    messag: "Ordered Updated Success fully but no available delivery boys"
                })


            }


            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                brodcastedTo: candidates,
                status: "brodcasted"
            })

            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id
            // console.log(shopOrder)
            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates[0],
                latitude: b.location.coordinates[1],
                mobile: b.mobile

            }))




            //sendi assignments for delivery boys
            await deliveryAssignment.populate("order")
            await deliveryAssignment.populate("shop")
            const io = req.app.get('io')
            if (io) {
                availableBoys.forEach(deliverBoy => {
                    const socketId = deliverBoy.socketId;
                    if (socketId) {
                        io.to(socketId).emit('newAssignment', {
                            sentTo: deliverBoy._id,
                            assignmentId: deliveryAssignment._id,
                            orderId: deliveryAssignment.order._id,
                            shopName: deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,
                            items: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
                            subTotal: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId))?.subTotal
                        })
                    }


                });
            }






        }

        await order.save()

        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)
        // console.log(updatedShopOrder)
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")
        await order.populate("user", "socketId")



        const io = req.app.get('io')

        if (io) {
            const userSocketId = order.user.socketId

            if (userSocketId) {
                io.to(userSocketId).emit('update-status', {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: order.user._id
                })
            }
        }


        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment?._id
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ messag: `Error for update Order Status : ${error}` })

    }
}

export const getDeliveryBoyAssignMen = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assignments = await DeliveryAssignment.find({
            brodcastedTo: deliveryBoyId,
            status: "brodcasted"
        })
            .populate("order")
            .populate("shop")
            .sort({ createdAt: -1 }); // 👈 Sort by creation time (latest first)
        const formated = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subTotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal
        }))

        return res.status(200).json(formated)

    } catch (error) {
        return res.status(500).json({ messag: `Error for geting delivery boy Assignment: ${error}` })

    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await DeliveryAssignment.findById(assignmentId);
        if (!assignment)
            return res.status(400).json({ message: "assignment not found" })
        if (assignment.status !== "brodcasted")
            return res.status(400).json({ message: "assignment is Expired" })

        const alreadyAssined = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["brodcasted", "completed"] }
        })
        if (alreadyAssined)
            return res.status(400).json({ message: "You are already assigned to another order" })

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)

        if (!order)
            return res.status(400).json({ message: "Order not Found" })

        let shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId

        await order.save()
        return res.status(200).json({ meesage: "Order Accepeted" })
    } catch (error) {
        return res.status(500).json({ messag: `Error for accepting order: ${error}` })

    }
}

export const getCurrentOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "assigned"

        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullName email location mobile" }]

            })

        if (!assignment)
            return res.status(400).json({ messag: "Assignment not Found" })

        if (!assignment.order)
            return res.status(400).json({ messag: "Assignment not Found" })


        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))

        if (!shopOrder)
            return res.status(400).json({ messag: "ShopOrder not Found" })

        let deliveryBoyLocation = { lat: null, lon: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }

        const customerLocation = { lat: null, lon: null }

        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude
        }

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })



    } catch (error) {
        return res.status(500).json({ messag: `Error for get current order: ${error}` })

    }
}

export const getOrderById = async (req, res) => {

    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()

        if (!order)
            return res.status(400).json({ messagae: "Orer not Found" })

        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ messag: `Error for get order by id order: ${error}` })

    }
}
export const sendDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body
        // console.log(orderId,shopOrderId);
        const order = await Order.findById(orderId).populate("user")
        // console.log(order)
        const shopOrder = order.shopOrders.id(shopOrderId)
        // console.log(shopOrder)

        if (!order || !shopOrder)
            return res.status(400).json({ messagae: "Pleas Enter Valid Orer/shopOrder Id (Send Delivery Otp)" })

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;  //expired in 5 min
        await order.save()

        await sendDeliveryOtpMail(order.user, otp)

        return res.status(200).json({ messag: `OTP sent Successfully to ${order.user?.fullName}` })
    } catch (error) {
        return res.status(500).json({ messag: `Error for Delivering OTP: ${error}` })

    }
}

export const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body
        if (!otp)
            return res.status(400).json({ messagae: "Pleas Enter the OTP " })


        const order = await Order.findById(orderId).populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId)

        if (!order || !shopOrder)
            return res.status(400).json({ messagae: "Pleas Enter Valid Orer/shopOrder Id (Send Delivery Otp)" })

        if (shopOrder.deliveryOtp !== otp || !shopOrder.otpExpires || shopOrder.otpExpires < Date.now())
            return res.status(400).json({ messagae: "Invalid/Expired OTP " })

        shopOrder.status = "delivered"
        shopOrder.deliveredAt = Date.now()
        order.payment = true

        await order.save()

        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy
        })

        return res.status(200).json({ messag: ' OTP Verified Successfully ' })


    } catch (error) {
        return res.status(500).json({ messag: `Error for Verifing OTP: ${error}` })

    }
}

export const getTodayDeliveries = async (req, res) => {
    try {
        const deliverBoyId = req.userId
        const startsOfDay = new Date()

        startsOfDay.setHours(0, 0, 0, 0)

        const orders = await Order.find({
            "shopOrders.assignedDeliveryBoy": deliverBoyId,
            "shopOrders.status": "delivered",
            "shopOrders.deliveredAt": { $gte: startsOfDay }

        }).lean()

        let todayDeliveries = []

        orders.forEach(order => {
            order.shopOrders.forEach(shopOrder => {
                if (shopOrder.assignedDeliveryBoy == deliverBoyId && shopOrder.status == "delivered"
                    && shopOrder.deliveredAt && shopOrder.deliveredAt >= startsOfDay) {

                    todayDeliveries.push(shopOrder)
                }
            })
        });

        let stats = {}

        todayDeliveries.forEach(shopOrder => {
            const hour = new Date(shopOrder.deliveredAt).getHours()
            stats[hour] = (stats[hour] || 0) + 1

        })

        let formattedStats = Object.keys(stats).map(hour=>({
            hour:parseInt(hour),
            count:stats[hour]
        }))

        formattedStats.sort((a,b)=>a.hour-b.hour)

        return res.status(200).json(formattedStats)


    } catch (error) {
        return res.status(500).json({ messag: `Error for getting today deliveries: ${error}` })

    }
}
