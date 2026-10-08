import express from "express"
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist_controllers.js"
import { isAuthenticated } from "../middleware/authMiddleware.js"

const wishlistRoutes = express.Router()

wishlistRoutes.post("/:productId", isAuthenticated, addToWishlist)
wishlistRoutes.get("/", isAuthenticated, getWishlist)
wishlistRoutes.delete("/:productId", isAuthenticated, removeFromWishlist)

export default wishlistRoutes