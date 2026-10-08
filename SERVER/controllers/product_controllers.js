import Product from "../models/product_model.js"
import mongoose from "mongoose"


export const createProduct = async (req, res) =>{
    try{
        const { name, description, price, category, image, stock } = req.body

        if(typeof price!=="number" || price<0){
            return res.status(400).json({message: "price must be a positive number"})
        }


        if(!name || !description || !price || !category || !image || !stock){
            return res.status(400).json({message:"All fields are required"})
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
            message:"Product created successfully",
            newProduct
        })

    }catch (error) {
        return res.status(500).json({message: "Server error", error: error.message})
    }
}

export const getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find().select("name price category image stock")

        return res.status(200).json({
            "success": true,
            "count": Product.length,
            products
        })

    } catch(error){
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getProductById = async (req, res) =>{
    try{
        const productId = req.params.id

        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({message:"Invalid product ID"})
        }

        const product = await Product.findById(productId)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }


        return res.status(200).json({message:"Product fetched successfully", product: product})


    } catch (error){
        return res.status(500).json({message:"Internal server error"})
    }
}
