import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:7000',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

// Product APIs
export const getAllProducts = (params) => {
    return axiosInstance.get('/products', { params })
}

export const getProductById = (id) => {
    return axiosInstance.get(`/products/${id}`)
}

// Wishlist APIs
export const addToWishlist = (productId) => {
    return axiosInstance.post(`/wishlist/${productId}`)
}

export const getWishlist = () => {
    return axiosInstance.get('/wishlist')
}

export const removeFromWishlist = (productId) => {
    return axiosInstance.delete(`/wishlist/${productId}`)
}

// Cart APIs
export const addToCart = (productId) => {
    return axiosInstance.post(`/cart/${productId}`)
}

export const getCart = () => {
    return axiosInstance.get('/cart')
}

export const updateCartQuantity = (productId, quantity) => {
    return axiosInstance.patch(`/cart/${productId}`, { quantity })
}

export const removeFromCart = (productId) => {
    return axiosInstance.delete(`/cart/${productId}`)
}

// Order APIs
export const createPaymentOrder = (shippingAddress) => {
    return axiosInstance.post('/orders/create-payment-order', { shippingAddress })
}

export const verifyPayment = (data) => {
    return axiosInstance.post('/orders/verify-payment', data)
}

export const getOrders = () => {
    return axiosInstance.get('/orders')
}

export const getOrderById = (id) => {
    return axiosInstance.get(`/orders/${id}`)
}