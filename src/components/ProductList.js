import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  getFavoriteProducts,
  getAllProducts,
  getProductsByCategory,
} from "../utils/api";

const ProductList = ({ favoritesOnly, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { category } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data;
        if (favoritesOnly) {
          data = await getFavoriteProducts(userId);
        } else if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getAllProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
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
                  src={product.images[0]}
                  alt={product.name}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>${product.price.toFixed(2)}</Card.Text>
                  <Link
                    to={{
                      pathname: `/products/${product._id}`,
                      state: { product },
                    }}
                  >
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
