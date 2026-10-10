import express from "express"
import {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
} from "../controllers/order_controllers.js"
import { isAuthenticated } from "../middleware/authMiddleware.js"

const orderRoutes = express.Router()

orderRoutes.post("/create-payment-order", isAuthenticated, createPaymentOrder)
orderRoutes.post("/verify-payment", isAuthenticated, verifyPayment)
orderRoutes.get("/", isAuthenticated, getOrders)
orderRoutes.get("/:id", isAuthenticated, getOrderById)

export default orderRoutes
