import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { submitOrder } from "../services/api";

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!cartItems || cartItems.length === 0) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Your Cart is Empty</h2>
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
            customer: formData,
            items: cartItems,
            total: getCartTotal(),
        };

        try {
            const response = await submitOrder(orderData);
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
        const phoneNumber = "919999999999"; // Placeholder number

        // 3. Open URL
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="cart-container" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
            <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>

            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                        <img
                            src={item.images && item.images[0]}
                            alt={item.name}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                            <p style={{ margin: "0" }}>Qty: {item.quantity}</p>
                            <p style={{ margin: "5px 0", fontWeight: "bold" }}>₹{item.price * item.quantity}</p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: "none", border: "none", color: "red", cursor: "pointer", height: "fit-content" }}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary" style={{ marginTop: "30px", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <span>Total:</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
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
