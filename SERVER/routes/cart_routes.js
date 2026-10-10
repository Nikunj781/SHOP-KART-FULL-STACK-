import express from "express"
import { addToCart, getCart, updateCartQuantity, removeFromCart } from "../controllers/cart_controllers.js"
import { isAuthenticated } from "../middleware/authMiddleware.js"

const cartRoutes = express.Router()

cartRoutes.post("/:productId", isAuthenticated, addToCart)
cartRoutes.get("/", isAuthenticated, getCart)
cartRoutes.patch("/:productId", isAuthenticated, updateCartQuantity)
cartRoutes.delete("/:productId", isAuthenticated, removeFromCart)

export default cartRoutes

