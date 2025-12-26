import React from "react";

const PriceFilter = ({ min, max, setRange }) => {
  return (
    <div className="filter-box">
      <h3>FILTER BY PRICE</h3>

      <input
        type="range"
        min={min}
        max={max}
        defaultValue={max}
        onChange={(e) => setRange(e.target.value)}
      />

      <p>Price: ₹{min} — ₹{max}</p>

      <button className="filter-btn">FILTER</button>
    </div>
  );
};

export default PriceFilter;
