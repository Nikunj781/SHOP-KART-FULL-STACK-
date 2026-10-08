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