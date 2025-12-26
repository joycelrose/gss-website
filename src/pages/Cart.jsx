import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { onlineWebsiteApi } from "../services/api";
import siteConfig from "../config/siteConfig";

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!cartItems || cartItems.length === 0) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2 className="modal-black-text" style={{ marginBottom: "20px" }}>Your Cart is Empty</h2>
                <Link to="/shop" style={{ textDecoration: "underline", color: "#b48a5a" }}>
                    Go to Shop
                </Link>
            </div>
        );
    }

    const handleCheckoutClick = () => {
        setShowCheckout(true);
    };

    const handleCloseCheckout = () => {
        setShowCheckout(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = async () => {
        if (!formData.name || !formData.phone) {
            alert("Please enter both Name and Phone Number.");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: null, // or add email field later
            items: cartItems,
            total: getCartTotal(),
        };

        try {
            const response = await onlineWebsiteApi.submitOrder(orderData);
            if (response.success) {
                alert("Order placed successfully! Our assistant will reach you out.");
                clearCart();
                setShowCheckout(false);
            }
        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleWhatsAppOrder = () => {
        if (!formData.name || !formData.phone) {
            alert("Please enter Name and Phone Number to start WhatsApp chat.");
            return;
        }

        // 1. Format the message
        let message = `*New Order from ${formData.name} (${formData.phone})*\n\n`;
        cartItems.forEach((item) => {
            message += `- ${item.name} (x${item.quantity}): ₹${item.price * item.quantity}\n`;
        });
        message += `\n*Total: ₹${getCartTotal().toLocaleString()}*`;

        // 2. Encode
        const encodedMessage = encodeURIComponent(message);
        // Use WhatsApp number from siteConfig, ensure country code
        let phoneNumber = siteConfig.whatsapp;
        if (phoneNumber.startsWith('+')) {
            phoneNumber = phoneNumber.replace('+', '');
        }
        if (!phoneNumber.startsWith('91')) {
            phoneNumber = '91' + phoneNumber;
        }

        // 3. Open URL
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="cart-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
            <h2 className="modal-black-text" style={{ marginBottom: "20px" }}>Your Cart</h2>

            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px', borderRadius: '10px' }}>
                        <img
                            src={item.images && item.images[0]}
                            alt={item.name}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <h4 className="modal-black-text cart-product-name" style={{ margin: 0 }}>{item.name}</h4>
                            <p className="modal-black-text cart-product-qty" style={{ margin: 0 }}>Qty: {item.quantity}</p>
                            <p className="modal-black-text cart-product-price" style={{ margin: '5px 0', fontWeight: 'bold' }}>₹{item.price * item.quantity}</p>
                        </div>
                        <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        style={{ background: "none", border: "none", color: "#b48a5a", cursor: "pointer", height: "fit-content", padding: 0, fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Remove from cart"
                                                >
                                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2" stroke="#b48a5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <line x1="9" y1="10" x2="9" y2="17" stroke="#b48a5a" strokeWidth="2" strokeLinecap="round"/>
                                                            <line x1="12" y1="10" x2="12" y2="17" stroke="#b48a5a" strokeWidth="2" strokeLinecap="round"/>
                                                            <line x1="15" y1="10" x2="15" y2="17" stroke="#b48a5a" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary" style={{ marginTop: "30px", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <span>Total:</span>
                    <span className="modal-black-text">₹{getCartTotal().toLocaleString()}</span>
                </h3>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={clearCart} style={{ padding: "10px 20px", border: "1px solid #ccc", background: "white", borderRadius: "4px", cursor: "pointer", color: "#333" }}>
                        Clear Cart
                    </button>
                    <button
                        onClick={handleCheckoutClick}
                        style={{ flex: 1, padding: "10px 20px", background: "#23180c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        Checkout
                    </button>
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            {showCheckout && (
                <div className="checkout-modal-backdrop">
                    <div className="checkout-modal">
                        <h3>Checkout</h3>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="checkout-actions">
                            <button className="submit-api-btn" onClick={handleSubmitOrder} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Order"}
                            </button>
                            <button className="whatsapp-btn" onClick={handleWhatsAppOrder}>
                                Order via WhatsApp
                            </button>
                            <button className="cancel-btn" onClick={handleCloseCheckout}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
