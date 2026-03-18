import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  getFavoriteProducts,
  getAllProducts,
  getProductsByCategory,
} from "../utils/api";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/640x480?text=No+Image";

const ProductList = ({ favoritesOnly, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { category } = useParams();

  useEffect(() => {
    let cancelled = false;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const runWithRetry = async (requestFn, retries = 2, waitMs = 1200) => {
      let lastError;

      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          return await requestFn();
        } catch (error) {
          lastError = error;
          const status = error?.response?.status;
          const shouldRetry = status >= 500 && attempt < retries;

          if (!shouldRetry) {
            throw error;
          }

          await delay(waitMs);
        }
      }

      throw lastError;
    };

    const fetchProducts = async () => {
      try {
        setErrorMessage("");
        let data;
        if (favoritesOnly) {
          data = await runWithRetry(() => getFavoriteProducts(userId));
        } else if (category) {
          data = await runWithRetry(() => getProductsByCategory(category));
        } else {
          data = await runWithRetry(() => getAllProducts());
        }

        const safeProducts = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        if (!cancelled) {
          setProducts(safeProducts);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          const apiMessage = error?.response?.data?.error;
          setErrorMessage(
            apiMessage ||
              "We could not load products right now. Please try again in a moment.",
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [category, favoritesOnly, userId]);

  const getTitle = () => {
    if (category) {
      return `Products in ${category}'s category`;
    } else if (favoritesOnly) {
      return "Favorite Products";
    } else {
      return "All Products";
    }
  };

  return (
    <div className="mx-4 mt-4">
      <h4 className="mb-4">{getTitle()}</h4>
      {!!errorMessage && (
        <Alert variant="warning" className="mb-4">
          {errorMessage}
        </Alert>
      )}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Fetching data from Render...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <Card style={{ cursor: "pointer" }}>
                <Card.Img
                  variant="top"
                  src={product?.images?.[0] || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    ${Number(product.price || 0).toFixed(2)}
                  </Card.Text>
                  <Link to={`/products/${product._id}`} state={{ product }}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
