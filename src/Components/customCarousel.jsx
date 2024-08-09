import React, { useState } from 'react';
import InventoryTable from './inventoryTable';
import AdditionsTable from './additionsTable';
import ExpensesTableCar from './ExpensesTableCar';
import "../styles/carousel.css"

function CustomCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const items = [
      <InventoryTable />,
      <AdditionsTable />,
      <ExpensesTableCar />
    ];
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
    };
  
    return (
      <div className="carousel-container">
        <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item, index) => (
            <div key={index} style={{ minWidth: '100%' }}>
              {item}
            </div>
          ))}
        </div>
        <div className="carousel-controls">
          <button onClick={handlePrev}>&#8249;</button>
          <button onClick={handleNext}>&#8250;</button>
        </div>
      </div>
    );
  }
  
export default CustomCarousel;
