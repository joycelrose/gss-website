import React from "react";

const ProductDialog = ({ product, open, onClose, onAddToCart, onBuy }) => {
  if (!open) return null;
  return (
    <div className="product-dialog-backdrop" onClick={onClose}>
      <div className="product-dialog" onClick={e => e.stopPropagation()}>
        <button className="dialog-close-btn" onClick={onClose}>&times;</button>
        <div className="dialog-content">
          <img src={product.images && product.images[0]} alt={product.name} className="dialog-image" />
          <h2 className="dialog-title">{product.name}</h2>
          <div className="dialog-price-box">
            {product.originalPrice && (
              <span className="dialog-old-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
            <span className="dialog-new-price">₹{product.price.toLocaleString()}</span>
          </div>
          <p className="dialog-description">{product.description}</p>
          <div className="dialog-actions">
            <button className="dialog-add-cart" onClick={() => onAddToCart(product)}>Add to Cart</button>
            <button className="dialog-buy" onClick={() => onBuy(product)}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDialog;
