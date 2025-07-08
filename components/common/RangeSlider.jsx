"use client";
import { useState } from "react";

// Lightweight dual range slider implementation using native <input type="range">.
// Removes the heavy @mui/material dependency and keeps the same public API.

export default function RangeSlider({
  min = 0,
  max = 100000,
  step = 100,
  initialValue = [200, 60000],
}) {
  const [value, setValue] = useState(initialValue);

  // Ensure sliders cannot cross over each other.
  const updateValue = (index) => (e) => {
    const newVal = Number(e.target.value);
    setValue((prev) => {
      const next = [...prev];
      next[index] = newVal;
      // Keep the lower value first
      return next.sort((a, b) => a - b);
    });
  };

  return (
    <div className="js-price-rangeSlider" style={{ padding: "20px 15px" }}>
      <div className="px-5">
        {/* Lower bound */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={updateValue(0)}
          className="w-100" // Use existing utility classes for full-width
        />

        {/* Upper bound */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={updateValue(1)}
          className="w-100 mt-2"
        />
      </div>

      <div className="d-flex justify-between mt-20">
        <span>Price:</span>
        <span className="fw-500 js-lower">{value[0]}</span>
        <span> - </span>
        <span className="fw-500 js-upper">{value[1]}</span>
      </div>
    </div>
  );
}
