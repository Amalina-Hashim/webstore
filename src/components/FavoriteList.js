import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getFavoriteProducts } from "../utils/api";

const FavoriteList = ({ userId }) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const response = await getFavoriteProducts(userId);
        console.log("API Response:", response);
        setFavoriteProducts(response);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        setError("Error fetching favorite products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [userId]);

  return (
    <div className="mx-4">
      <h4 className="mb-4">Favorite Products</h4>
      {isLoading ? (
        <p>Loading favorites...</p>
      ) : (
        <div className="row">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product, index) => (
              <div key={index} className="col-md-4 mb-4">
                <Card
                  key={product._id} 
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={product.images[0]}
                    alt={product.name}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>${product.price}</Card.Text>
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
            ))
          ) : (
            <p>No favorite products found.</p>
          )}
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FavoriteList;
