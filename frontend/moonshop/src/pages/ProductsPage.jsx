import React, { useState, useEffect } from 'react'
//import Card from "react-bootstrap/Card";
//import Button from "react-bootstrap/Button";
import "../assets/styles/products.css";
import ProductItem from '../components/ProductItem';
import useProductData from '../hooks/useProductData';
import Spinner from '../components/Spinner';

const ProductsPage = () => {
    const {products, loading} = useProductData()

    if (loading) {
        return <Spinner /> 
    }
    
    return (
        <>
            <div className="products-page">
                <h1 className="page-title">Our Products</h1>
                <p className="page-description">
                    Explore our collection of branded T-shirts, crafted for comfort and style.
                </p>
                <div className="product-container">
                {products.map((product) => <ProductItem product={product} key={product.id}/>)}
                </div>
            </div>
        </>
    )
}

export default ProductsPage