export const submitOrder = async (orderData) => {
    // Placeholder API endpoint
    const API_URL = "/api/orders";

    console.log("Submitting order to:", API_URL);
    console.log("Payload:", orderData);

    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For now, always resolve successfully to simulate behavior
            resolve({ success: true, message: "Order placed successfully!" });
        }, 1000);
    });
};
