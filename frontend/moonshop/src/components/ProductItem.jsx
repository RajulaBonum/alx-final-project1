import React from 'react'
import '../assets/styles/products.css'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { BaseUrl } from '../apis/api';

const ProductItem = ({product}) => {
    const baseurl = BaseUrl
    const navigate = useNavigate()

    // Ensure product and product.image exist before trying to access them
    ''

  return (
    <div>
        <Card key={product.id} className="product-card">
            <Card.Img
            variant="top"
            src={`${baseurl}${product.image}`}
            alt={product.title}
            />
            <Card.Body>
            <Card.Title className="product-title">{product.name}</Card.Title>
            <Card.Text className="product-price">Ksh {product.price}</Card.Text>
            <Button
                variant="primary"
                className="product-btn"
                onClick={() => navigate(`/product/${product.slug}`, { state: product })}
            >
                Order Now
            </Button>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ProductItem