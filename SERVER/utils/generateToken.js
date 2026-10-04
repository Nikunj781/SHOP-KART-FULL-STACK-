import jwt from "jsonwebtoken"

export const generateToken = (customerId)=>{
    const token = jwt.sign({id: customerId}, process.env.JWT_SECRET, {expiresIn: '3d'})
    return token
}