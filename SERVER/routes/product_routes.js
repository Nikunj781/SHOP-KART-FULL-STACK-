import express from "express"
import { createProduct, getAllProducts, getProductById } from "../controllers/product_controllers.js"
import { upload } from "../middleware/upload.js"


const productRoutes = express.Router()


productRoutes.post("/", upload.single("image"), createProduct)
// productRoutes.post("/", createProduct)
productRoutes.get("/",getAllProducts)
productRoutes.get("/:id", getProductById)

export default productRoutes