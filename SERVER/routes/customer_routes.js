import express from "express"
import { registerUser, loginUser, getUser, logoutUser} from "../controllers/customer_controllers.js"
import { isAuthenticated } from "../middleware/authMiddleware.js"


const customerRoutes = express.Router()

customerRoutes.post("/register", registerUser)
customerRoutes.post("/login", loginUser)
customerRoutes.get("/me", isAuthenticated, getUser)
customerRoutes.post("/logout", logoutUser)

export default customerRoutes