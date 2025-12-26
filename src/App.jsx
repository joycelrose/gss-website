import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';

function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ width: '100vw', minHeight: '100vh', boxSizing: 'border-box', overflowX: 'hidden', background: '#f8f4ee' }}>
          <Header />
          <main style={{ minHeight: '80vh', width: '100vw', margin: '0 auto', boxSizing: 'border-box' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
