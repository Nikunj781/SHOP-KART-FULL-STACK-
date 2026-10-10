import crypto from "crypto"
import Customer from "../models/customer_model.js"
import Product from "../models/product_model.js"
import Order from "../models/order_model.js"
import razorpay from "../config/razorpay.js"

// POST /orders/create-payment-order
// 1. Validate cart  2. Re-check stock  3. Calculate total on server
// 4. Snapshot items  5. Create pending ShopKart order
// 6. Create Razorpay Order  7. Return safe checkout data
export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body

        // --- Basic shipping address validation ---
        const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"]
        for (const field of required) {
            if (!shippingAddress?.[field] || String(shippingAddress[field]).trim() === "") {
                return res.status(400).json({ message: `Shipping field '${field}' is required` })
            }
        }

        // --- Load user with populated cart ---
        const customer = await Customer.findById(req.customer._id).populate({
            path: "cart.product",
            select: "name price image stock"
        })

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        // --- Re-fetch each product for latest data + stock check ---
        const orderItems = []
        let totalAmount = 0

        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product._id)

            if (!product) {
                return res.status(404).json({
                    message: `Product '${cartItem.product.name}' is no longer available`
                })
            }

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} unit(s) available.`
                })
            }

            // Build snapshot item
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })

            // Server-calculated total
            totalAmount += product.price * cartItem.quantity
        }

        // --- Create pending ShopKart order ---
        const shopKartOrder = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        })

        // --- Create Razorpay Order (amount in paise) ---
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: shopKartOrder._id.toString()
        })

        // --- Save Razorpay order id ---
        shopKartOrder.razorpayOrderId = razorpayOrder.id
        await shopKartOrder.save()

        return res.status(200).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID   // Key ID only, never the secret
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// POST /orders/verify-payment
// Verify HMAC SHA-256 signature → mark PAID → clear cart
export const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const order = await Order.findById(shopKartOrderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Ownership check
        if (order.user.toString() !== req.customer._id.toString()) {
            return res.status(403).json({ message: "Forbidden" })
        }

        // --- Verify HMAC SHA-256 signature ---
        // Razorpay signs: razorpayOrderId + "|" + razorpayPaymentId
        // Use the order id stored in OUR database — not blindly from the request body
        const body = order.razorpayOrderId + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            // Mark order as failed but keep cart intact
            order.paymentStatus = "FAILED"
            await order.save()
            return res.status(400).json({ success: false, message: "Invalid payment signature" })
        }

        // --- Signature valid: confirm order ---
        order.paymentStatus = "PAID"
        order.status = "PLACED"
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        // --- Clear user cart only after verified payment ---
        const customer = await Customer.findById(req.customer._id)
        customer.cart = []
        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Payment verified. Order placed successfully.",
            order
        })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// GET /orders  — All orders for the authenticated user, newest first
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.customer._id }).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

// GET /orders/:id  — Single order, ownership enforced
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (order.user.toString() !== req.customer._id.toString()) {
            return res.status(403).json({ message: "Forbidden" })
        }

        return res.status(200).json({ success: true, order })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}
