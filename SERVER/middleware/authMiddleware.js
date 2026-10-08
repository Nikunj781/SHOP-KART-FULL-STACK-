import jwt from "jsonwebtoken"
import Customer from "../models/customer_model.js"

export const isAuthenticated = async (req, res, next) => {
    try {

        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const customer = await Customer.findById(decoded.id).select("-password")

        if (!customer) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        req.customer = customer
        next()

        //new line added by nikunj
        return res.status(200).json({
            message: "User Authenticated",
            userData: req.customer
        })

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

}