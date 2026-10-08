import Product from "../models/product_model.js"
import mongoose from "mongoose"
import { uploadToCloudinary } from "../utils/cloudinary.js"


export const createProduct = async (req, res) => {
    try {
        const { name, description, category } = req.body
        const price = Number(req.body.price)
        const stock = Number(req.body.stock)

        if (!name || !description || !category || (!req.file && !req.body.image) ||
            !req.body.price || req.body.stock === undefined || req.body.stock === '') {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!(price > 0)) {
            return res.status(400).json({ message: "price must be greater than 0" })
        }

        if (!(stock >= 0)) {
            return res.status(400).json({ message: "stock must be 0 or more" })
        }

        let image = req.body.image
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
            image = result.secure_url
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        })

        return res.status(201).json({
            message: "Product created successfully",
            newProduct
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getAllProducts = async (req, res) => {
    try {

        const { search, category, sort } = req.query

        const filter = {}

        // Search by product name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            }
        }

        // Filter by category
        if (category) {
            filter.category = category
        }

        let query = Product.find(filter).select("name price category image stock")

        if (sort === "price_asc") {
            query = query.sort({ price: 1 })
        } else if (sort === "price_desc") {
            query = query.sort({ price: -1 })
        }

        const products = await query

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }


        return res.status(200).json({ message: "Product fetched successfully", product: product })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}
