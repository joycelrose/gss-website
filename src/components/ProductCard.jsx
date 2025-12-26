import React from "react";


const ProductCard = ({ product, onClick, onRead, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={onClick} style={{ cursor: 'pointer', position: 'relative' }}>
        <img src={product.images && product.images[currentImageIndex]} alt={product.name} />
        {product.outOfStock && (
          <span className="out-of-stock">OUT OF STOCK</span>
        )}

        {product.images && product.images.length > 1 && (
          <>
            <button className="card-carousel-btn prev" onClick={prevImage}>&#10094;</button>
            <button className="card-carousel-btn next" onClick={nextImage}>&#10095;</button>
          </>
        )}
      </div>

      <h3 className="product-title">
        {product.name}
      </h3>

      <div className="price-box">
        {product.originalPrice && (
          <span className="old-price">₹{product.originalPrice.toLocaleString()}</span>
        )}
        <span className="new-price">₹{product.price.toLocaleString()}</span>
      </div>

      <div className="card-actions">
        <button className="read-btn" onClick={onRead}>READ</button>
        <button className="add-cart-btn" onClick={handleAddToCartClick}>ADD TO CART</button>
      </div>
    </div>
  );
};

export default ProductCard;
