import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = (buffer, mimetype) => {
    const base64 = buffer.toString('base64')
    return cloudinary.uploader.upload(`data:${mimetype};base64,${base64}`, {
        folder: 'shopkart/products'
    })
}