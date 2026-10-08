import mongoose from "mongoose"
import Customer from "../models/customer_model.js"
import Product from "../models/product_model.js"

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const customer = await Customer.findById(req.customer._id)

        const alreadyInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        )

        if (alreadyInWishlist) {
            return res.status(409).json({ message: "Product already in wishlist" })
        }

        customer.wishlist.push(productId)
        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id)
            .populate({
                path: "wishlist",
                select: "name price category image stock"
            })

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        const customer = await Customer.findById(req.customer._id)

        const isInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        )

        if (!isInWishlist) {
            return res.status(404).json({ message: "Product not in wishlist" })
        }

        customer.wishlist = customer.wishlist.filter(
            (id) => id.toString() !== productId
        )
        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}