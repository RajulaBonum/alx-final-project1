import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../assets/styles/products.css";
import { BaseUrl } from '../apis/api';


const RelateProducts = ({products}) => {
  
  const navigate = useNavigate()
  const baseurl = BaseUrl 

  return (
    <>
      <div className='related-section'>
        <h2>Related Products</h2>
      </div>
      <div className="product-container">
          {products.map((product) => (
          <Card key={product.id} className="product-card">
              <Card.Img
              variant="top"
              src={`${baseurl}${product.image}`}
              alt={product.name}
              />
              <Card.Body>
              <Card.Title className="product-title">{product.name}</Card.Title>
              <Card.Text className="product-price">Ksh {product.price}</Card.Text>
              <Button
                  variant="primary"
                  className="product-btn"
                  onClick={() => navigate(`/product/${product.slug}`)}
              >
                  Order Now
              </Button>
              </Card.Body>
          </Card>
          ))}
      </div>
    </>
  )
}

export default RelateProducts