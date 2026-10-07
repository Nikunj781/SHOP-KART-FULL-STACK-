import Customer from "../models/customer_model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
}


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const emailExists = await Customer.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: 'Email already exists' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newCustomer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            phone
        })

        const token = generateToken(newCustomer._id)
        res.cookie("token", token, cookieOptions)

        return res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customer: {
                _id: newCustomer._id, name: newCustomer.name,
                email: newCustomer.email, phone: newCustomer.phone
            }
        })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}


export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const passwordCheck = await bcrypt.compare(password, customer.password)
        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = generateToken(customer._id)
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: 'Customer logged in successfully',
            customer: { _id: customer._id, name: customer.name, email: customer.email, phone: customer.phone }
        })

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

export const getUser = async (req, res) => {
    return res.status(200).json({ message: "Customer Authenticated", userData: req.customer })
}

export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })

    return res.status(200).json({ success: true, message: 'Logged out successfully' })
}

//Bonus function
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Old and new password are required' })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
        }

        const customer = await Customer.findById(req.user._id)

        const isMatch = await bcrypt.compare(oldPassword, customer.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' })
        }

        customer.password = await bcrypt.hash(newPassword, 10)
        await customer.save()

        return res.status(200).json({ success: true, message: 'Password changed successfully' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}