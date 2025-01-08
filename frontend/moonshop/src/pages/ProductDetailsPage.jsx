import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../assets/styles/productDetails.css";
import RelateProducts from "../components/RelateProducts";
import api, { BaseUrl } from "../apis/api";
import { toast } from "react-toastify";

const ProductDetailsPage = ({ setNumItems }) => {
  const { slug } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [product, setProductDetail] = useState({});
  const [inCart, setInCart] = useState(false);
  const cart_code = localStorage.getItem("cart_code");

  const baseurl = BaseUrl;

  // State variables for size, color, and custom design
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [customDesign, setCustomDesign] = useState(null);

  // This is used to fetch products details of product corresponding to the slug
  useEffect(() => {
    api
      .get(`product_detail/${slug}`)
      .then((res) => {
        setProductDetail(res.data);
        setSimilarProducts(res.data.similar_products);
      })
      .catch((err) => console.log(err.message));
  }, [slug]);

  useEffect(() => {
    if (cart_code && product.id) {
      api
        .get(`product_in_cart?cart_code=${cart_code}&product_id=${product.id}`)
        .then((res) => setInCart(res.data.product_in_cart))
        .catch((err) => console.log(err.message));
    }
  }, [cart_code, product.id]);

  const add_item = () => {
    // Dynamic validation based on category
    if (
      (product.category === "T-shirts" || product.category === "Hoodies") &&
      (!size || !color)
    ) {
      toast.error("Please select both size and color.");
      return;
    }
    if (!color) {
      toast.error("Please select a color.");
      return;
    }

    const formData = new FormData();
    formData.append("cart_code", cart_code);
    formData.append("product_id", product.id);
    if (size) formData.append("size", size);
    formData.append("color", color);
    if (customDesign) formData.append("custom_design", customDesign);

    api
      .post("add_item/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Product Added To Cart");
        setInCart(true);
        setNumItems((curr) => curr + 1);
      })
      .catch((err) => {
        toast.error("Failed to add product to cart.");
        console.log(err.message);
      });
  };

  return (
    <div className="product-details-page">
      <div className="product-detail-box">
        <div className="products-detail-about">
          <h1>{product.name}</h1>
          <img
            src={`${baseurl}${product.image}`}
            alt={product.title}
            className="product-image"
          />
          <p className="product-price">Price: Ksh {product.price}</p>
        </div>

        <Form className="products-detail-form product-options">
          {(product.category === "T-shirts" || product.category === "Hoodies") && (
            <Form.Group controlId="size">
              <Form.Label>Size</Form.Label>
              <Form.Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group controlId="color" className="mt-3">
            <Form.Label>Color</Form.Label>
            <Form.Select
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Gray">Gray</option>
              <option value="Black">Black</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="customDesign" className="mt-3">
            <Form.Label>Custom Design (optional)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setCustomDesign(e.target.files[0])}
            />
          </Form.Group>
        </Form>

        <div>
          <Button
            variant="primary"
            className="mt-4"
            onClick={add_item}
            disabled={inCart}
          >
            {inCart ? "Added to Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <div className="product-detail-info">
        <h2 className="product-info-title">{product.title}</h2>
        <p className="product-info-description">{product.description}</p>
      </div>

      <RelateProducts products={similarProducts} />

      <Link to="/products" className="more-btn">
        View More Products
      </Link>
    </div>
  );
};

export default ProductDetailsPage;
