import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  addToCart,
  addToFavorites,
  removeFromFavorites,
} from "../utils/api";
import { updateCartItemCount } from "../utils/cartUtils";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        setIsFavorite(productData.isFavorite);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      updateCartItemCount(setCartItemCount);
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleToggleFavorite = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const updatedIsFavorite = !isFavorite;
      setIsFavorite(updatedIsFavorite);

      if (!product) {
        console.error("Product data is not available.");
        return;
      }

      const productId = product._id;

      if (updatedIsFavorite) {
        await addToFavorites(productId);
      } else {
        await removeFromFavorites(productId, token);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorite(!isFavorite);
    }
  };

const handleAddToCart = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const quantity = 1;
    await addToCart(userId, productId, quantity, (updatedCount) =>
      setCartItemCount(updatedCount)
    );
    const newCount = parseInt(localStorage.getItem("cartItems") || "0");
    setCartItemCount(newCount);
    updateCartItemCount(setCartItemCount); // Add this line
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
  window.dispatchEvent(new CustomEvent("cartUpdated"));
};

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4 mx-3">Product Detail</h2>
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        className="mb-2 ms-3"
      >
        Back
      </Button>{" "}
      {isLoggedIn && (
        <>
          <Button variant="success" onClick={handleAddToCart} className="mb-2">
            Add to Cart
          </Button>{" "}
          <Button
            variant={isFavorite ? "danger" : "outline-danger"}
            onClick={handleToggleFavorite}
            className="mb-2"
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>{" "}
        </>
      )}
      <div className="card mx-3">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img
              src={product.images[0]}
              className="card-img"
              alt={product.name}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">Category: {product.category}</p>
              <p className="card-text">Price: ${product.price.toFixed(2)}</p>
              <p className="card-text">Description: {product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
