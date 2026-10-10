const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { product, quantity } = item

  return (
    <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="mt-1 font-bold text-gray-800">₹{product.price.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrease(product._id, quantity)}
              disabled={quantity <= 1}
              className="h-7 w-7 rounded border text-lg font-bold leading-none disabled:opacity-40"
            >
              −
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => onIncrease(product._id, quantity, product.stock)}
              disabled={quantity >= product.stock}
              className="h-7 w-7 rounded border text-lg font-bold leading-none disabled:opacity-40"
            >
              +
            </button>
          </div>

          {/* Line subtotal */}
          <p className="font-semibold text-gray-700">
            ₹{(product.price * quantity).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => onRemove(product._id)}
          className="mt-2 self-start text-xs text-red-500 underline"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem

