import React, { useState, useEffect } from "react";
import { products } from "../config/products";
import ProductCard from "../components/ProductCard";
import "../components/shop.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  /* ---------------- MOBILE DETECTION ---------------- */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- FILTER DATA ---------------- */
  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const categories = [...new Set(products.map((p) => p.category))];

  /* ---------------- STATES ---------------- */
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState("latest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  /* ---------------- HANDLERS ---------------- */
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceMax(maxPrice);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setZoomScale(1);
    setIsFullScreen(false);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    closeProductModal();
  };

  const handlePlaceOrder = (product) => {
    addToCart(product);
    closeProductModal();
    navigate("/cart");
  };

  /* ---------------- CAROUSEL HANDLERS ---------------- */
  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const totalImages = selectedProduct.images ? selectedProduct.images.length : 0;
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const totalImages = selectedProduct.images ? selectedProduct.images.length : 0;
    if (totalImages > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  };

  /* ---------------- FULL SCREEN ZOOM HANDLERS ---------------- */
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    setZoomScale(1);
    setDragPos({ x: 0, y: 0 }); // Reset drag
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomScale((prev) => Math.max(prev - 0.5, 1));
  };

  /* ---------------- DRAG HANDLERS ---------------- */
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragPos({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /* ---------------- FILTER + SORT ---------------- */
  let filteredProducts = products.filter(
    (p) =>
      p.price <= priceMax &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(p.category))
  );

  switch (sortOption) {
    case "priceLowHigh":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
      const activeFilterCount = [
        priceMax !== maxPrice,
        (selectedCategories.length > 0)
      ].filter(Boolean).length;
      break;
    default:
      filteredProducts.sort((a, b) => b.id - a.id);
  }

  // Helper to count active filters
  const activeFilterCount = [
    priceMax !== maxPrice,
    (selectedCategories.length > 0)
  ].filter(Boolean).length;

  return (
    <main className="shop-container">
      {/* ---------------- MOBILE FILTER MODAL ---------------- */}
      {isMobile && showFilter && (
        <div
          className="mobile-filter-modal"
          onClick={(e) =>
            e.target.classList.contains("mobile-filter-modal") &&
            setShowFilter(false)
          }
        >
          <div
            className="mobile-filter-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="filter-modal-close-btn"
              onClick={() => setShowFilter(false)}
            >
              ×
            </button>

            <h4>FILTER BY PRICE</h4>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <p>Up to ₹{priceMax.toLocaleString()}</p>

            <h4>CATEGORIES</h4>
            {categories.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            ))}

            <div className="filter-modal-btns">
              <button onClick={clearFilters}>CLEAR</button>
              <button onClick={() => setShowFilter(false)}>APPLY</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PRODUCT DETAILS MODAL ---------------- */}
      {selectedProduct && (
        <>
          {/* FULL SCREEN ZOOM OVERLAY */}
          {isFullScreen && (
            <div className="fullscreen-overlay" onClick={toggleFullScreen}>
              <button
                className="fullscreen-close-btn"
                onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }}
              >
                ×
              </button>

              <div
                className="fullscreen-content"
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={selectedProduct.images && selectedProduct.images[currentImageIndex]}
                  alt={selectedProduct.name}
                  className="fullscreen-image"
                  style={{
                    transform: `translate(${dragPos.x}px, ${dragPos.y}px) scale(${zoomScale})`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                  onMouseDown={handleMouseDown}
                />

                <div className="fullscreen-controls">
                  <button onClick={handleZoomOut}>-</button>
                  <span>{(zoomScale * 100).toFixed(0)}%</span>
                  <button onClick={handleZoomIn}>+</button>
                </div>
              </div>
            </div>
          )}

          {/* STANDARD MODAL */}
          <div className="product-dialog-backdrop" onClick={closeProductModal}>
            <div className="product-dialog" onClick={(e) => e.stopPropagation()}>
              <button className="dialog-close-btn" onClick={closeProductModal}>×</button>
              <div className="dialog-content">
                <div className="dialog-carousel">
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <button className="carousel-btn prev" onClick={prevImage}>&#10094;</button>
                  )}

                  <img
                    src={selectedProduct.images && selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    className="dialog-image"
                    onClick={toggleFullScreen}
                    style={{ cursor: 'zoom-in' }}
                  />

                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <button className="carousel-btn next" onClick={nextImage}>&#10095;</button>
                  )}
                </div>
                <h3 className="dialog-title">{selectedProduct.name}</h3>
                <div className="dialog-price-box">
                  {selectedProduct.originalPrice && (
                    <span className="dialog-old-price">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                  )}
                  <span className="dialog-new-price">₹{selectedProduct.price.toLocaleString()}</span>
                </div>
                <p className="dialog-description">{selectedProduct.description || "No description available."}</p>

                <div className="dialog-actions">
                  <button
                    className="dialog-add-cart"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    ADD TO CART
                  </button>
                  <button
                    className="dialog-buy"
                    onClick={() => handlePlaceOrder(selectedProduct)}
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- LEFT SIDEBAR (DESKTOP ONLY) ---------------- */}
      {!isMobile && (
        <aside className="sidebar">
          <div className="filter-box">
            <h4>FILTER BY PRICE</h4>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
            <p>Up to ₹{priceMax.toLocaleString()}</p>

            <hr />

            <h4>CATEGORIES</h4>
            {categories.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            ))}

            <div className="filter-btn-row">
              <button onClick={clearFilters}>CLEAR</button>
              <button>APPLY</button>
            </div>
          </div>
        </aside>
      )}

      {/* ---------------- PRODUCTS ---------------- */}
      <section className="products-section">
        <div className="shop-header">
          <div className="shop-header-row">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="shop-sort-select"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
            {isMobile && (
              <button
                className="mobile-filter-btn"
                onClick={() => setShowFilter(true)}
                aria-label="Open filters"
                style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H21M6 12H18M10 19H14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </button>
            )}
          </div>
          <p className="shop-results-text">
            Showing {filteredProducts.length} of {products.length} results
          </p>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openProductModal(product)}
              onRead={() => openProductModal(product)}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Shop;
