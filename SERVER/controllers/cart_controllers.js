import mongoose from "mongoose"
import Customer from "../models/customer_model.js"
import Product from "../models/product_model.js"

// POST /cart/:productId
export const addToCart = async (req, res) => {
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

        const existingItem = customer.cart.find(
            (item) => item.product.toString() === productId
        )

        if (existingItem) {
            // Increase quantity by 1
            const newQty = existingItem.quantity + 1
            if (newQty > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock} units available in stock`
                })
            }
            existingItem.quantity = newQty
        } else {
            // Add new cart item with quantity 1
            if (product.stock < 1) {
                return res.status(400).json({ message: "Product is out of stock" })
            }
            customer.cart.push({ product: productId, quantity: 1 })
        }

        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// GET /cart
export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path: "cart.product",
            select: "name price image stock category"
        })

        return res.status(200).json({
            success: true,
            cart: customer.cart
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// PATCH /cart/:productId
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be a number and at least 1" })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} units available in stock`
            })
        }

        const customer = await Customer.findById(req.customer._id)

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        )

        if (!cartItem) {
            return res.status(404).json({ message: "Product not in cart" })
        }

        cartItem.quantity = quantity
        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Quantity updated",
            cart: customer.cart
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        const customer = await Customer.findById(req.customer._id)

        const isInCart = customer.cart.some(
            (item) => item.product.toString() === productId
        )

        if (!isInCart) {
            return res.status(404).json({ message: "Product not in cart" })
        }

        customer.cart = customer.cart.filter(
            (item) => item.product.toString() !== productId
        )

        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

