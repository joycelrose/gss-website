import React, { useState } from "react";
import siteConfig from "../config/siteConfig";
import "../components/contact.css";
import { onlineWebsiteApi } from "../services/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("sending");

    try {
      // If email is empty, pass null to API
      const payload = { ...form, email: form.email.trim() === "" ? null : form.email };
      const response = await onlineWebsiteApi.submitContact(payload);

      if (response.success) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Normalize WhatsApp number for wa.me link
  let whatsappNumber = siteConfig.whatsapp;
  if (whatsappNumber.startsWith('+')) {
    whatsappNumber = whatsappNumber.replace('+', '');
  }
  if (!whatsappNumber.startsWith('91')) {
    whatsappNumber = '91' + whatsappNumber;
  }

  return (
    <main className="contact-page">
      {/* TOP SECTION */}
      <section className="contact-top">
        {/* MAP */}
        <div className="map-box">
          <iframe
            src={siteConfig.googleMapsEmbedUrl}
            title="Google Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* INFO */}
        <div className="info-box">
          <h1>CONTACT INFO</h1>

          <p className="subtitle">
            FEEL FREE TO CONTACT US FOR ANY QUERY AS WELL FOR BOOKING SCHEDULE FOR SHOPPING
          </p>

          <div className="info-row">
            📍
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.address}
            </a>
          </div>

          <div className="info-row">
            🕒
            <span>
              {siteConfig.openingDays}: {siteConfig.openingHours}
            </span>
          </div>

          <div className="info-row">
            <span style={{ display: 'flex', alignItems: 'center', width: 20, minWidth: 20, justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ display: 'none' }} id="whatsapp-svg-icon">
                <circle cx="16" cy="16" r="16" fill="#25D366" />
                <path d="M23.5 20.5c-.3-.2-1.7-.8-2-1s-.5-.2-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.3-.8-.7-1.4-1.5-1.6-1.8-.2-.3 0-.5.1-.7.1-.1.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-.7.7-.7 1.7 0 1 .7 2 1.1 2.5.5.6 2.1 2.5 5.1 3.3.7.2 1.2.3 1.6.2.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2z" fill="#fff" />
              </svg>
              <span style={{ fontSize: '1.5rem', display: 'block' }}>📱</span>
            </span>
            <div className="contact-numbers">
              {siteConfig.contacts.map((c, i) => {
                if (c.label === "WhatsApp") {
                  return (
                    <a
                      key={i}
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ verticalAlign: 'middle' }}>
                        <circle cx="16" cy="16" r="16" fill="#25D366" />
                        <path d="M23.5 20.5c-.3-.2-1.7-.8-2-1s-.5-.2-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.3-.8-.7-1.4-1.5-1.6-1.8-.2-.3 0-.5.1-.7.1-.1.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-.7.7-.7 1.7 0 1 .7 2 1.1 2.5.5.6 2.1 2.5 5.1 3.3.7.2 1.2.3 1.6.2.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2z" fill="#fff" />
                      </svg>
                      {c.number}
                    </a>
                  );
                } else if (c.label === "Facebook") {
                  return (
                    <a
                      key={i}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ verticalAlign: 'middle' }}>
                        <circle cx="16" cy="16" r="16" fill="#1877F3" />
                        <path d="M20.5 16.5H18V25h-3v-8.5h-1.5V14H15v-1.5c0-1.4.8-3.5 3.5-3.5h2V12h-2c-.3 0-.5.2-.5.5V14h2.5l-.5 2.5z" fill="#fff" />
                      </svg>
                      Facebook
                    </a>
                  );
                } else if (c.number) {
                  return (
                    <a
                      key={i}
                      href={`tel:${c.number.replace(/\s+/g, "")}`}
                      className="contact-link"
                    >
                      {c.number}
                    </a>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>

          <div className="info-row">
            ✉️
            <a href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="contact-form">
        <h1>SEND MESSAGE</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              name="name"
              placeholder="Your name*"
              required
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Your phone*"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="message"
            rows="5"
            placeholder="Your message*"
            required
            value={form.message}
            onChange={handleChange}
            style={{ color: 'black' }}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SENDING..." : "SUBMIT"}
          </button>

          {status === "sent" && (
            <p className="success">Thank you! Your message has been sent.</p>
          )}
          {status === "error" && (
            <p className="error" style={{ color: 'red', marginTop: 10 }}>Failed to send message. Please try again.</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Contact;
