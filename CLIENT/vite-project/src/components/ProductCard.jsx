import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="mb-3 h-40 w-full rounded-lg object-cover"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-1 font-bold">₹{product.price}</p>
      <p className="text-xs text-gray-500">
        {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
      </p>
      <button
        onClick={() => navigate(`/products/${product._id}`)}
        className="mt-3 w-full rounded bg-black py-1.5 text-sm font-semibold text-white"
      >
        View Details
      </button>
    </div>
  )
}

export default ProductCard