import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import customerRoutes from './routes/customer_routes.js'
import productRoutes from './routes/product_routes.js'
import wishlistRoutes from './routes/wishlist_routes.js'
import cartRoutes from './routes/cart_routes.js'
import orderRoutes from './routes/order_routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 7000

// Cached MongoDB connection for Serverless environments
let isConnected = false
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return
    }
    try {
        await mongoose.connect(process.env.dbURL)
        isConnected = true
        console.log('Database connected successfully')
    } catch (err) {
        console.error('Database connection failed', err)
    }
}
connectDB()

// Middleware to ensure DB connection before request processing
app.use(async (req, res, next) => {
    await connectDB()
    next()
})

// CORS Configuration supporting local dev, custom CLIENT_URL, and Vercel domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, same-origin)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error('Origin is not allowed by CORS'))
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ success: true, message: 'ShopKart API is running' })
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

// Only listen when running as a standalone server, not inside Vercel serverless
if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('Server is running on port ' + PORT)
    })
}

export default app
