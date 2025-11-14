import express from "express"
import dotenv from "dotenv"
dotenv.config()
import http from 'http'

import connectDb from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoutes.js"
import shopRouter from "./routes/shopRoutes.js"
import itemRouter from "./routes/itemRoute.js"
import orderRouter from "./routes/orderRoutes.js"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['POST', 'GET']
    }
})

app.set("io", io)



const port = process.env.PORT || 5000
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/item", itemRouter)
app.use("/api/shop", shopRouter)
app.use("/api/order", orderRouter)

socketHandler(io)

const connection = async () => {
    try {
        await connectDb();
        console.log("Connected to db");

        server.listen(port, () => {
            console.log("Server Started at port number", port);
        })

    } catch (error) {
        console.log("Error to Connected to database", error);

    }

}

await connection();

