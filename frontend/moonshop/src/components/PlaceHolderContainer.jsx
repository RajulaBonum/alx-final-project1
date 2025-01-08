import React from 'react'
import PlaceHolder from './PlaceHolder';
import '../assets/styles/products.css';

const PlaceHolderContainer = () => {
    const placeNumbers = [...Array(12).keys()].slice(0)

  return (
    <div className="product-container">
        {placeNumbers.map((num) => 
            <PlaceHolder key={num} />
        )}
        
    </div>
  )
}

export default PlaceHolderContainer