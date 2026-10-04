import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import customerRoutes from './routes/customer_routes.js'
import cookieParser from 'cookie-parser'


dotenv.config()


const app = express()
const PORT = process.env.PORT || 7000


mongoose.connect(process.env.dbURL).then (()=>{
    console.log('Database connected successfully')
}).catch((err)=>{
    console.log('Database connection failed', err)
})


app.use(express.json())
app.use(cookieParser())
app.use('/customer',customerRoutes)



app.listen(PORT, ()=>{
    console.log('Server is running on port ' + PORT)
})


export default app
