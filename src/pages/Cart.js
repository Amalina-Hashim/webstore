import React, { useState, useEffect } from "react";
import { getUserCart, removeFromCart } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import { updateCartItemCount } from "../utils/cartUtils";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [, setCartItemCount] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const data = await getUserCart(userId);
        if (data && data.cart && data.cart.products) {
          const groupedData = {};
          data.cart.products.forEach((product) => {
            if (groupedData[product.product._id]) {
              groupedData[product.product._id].quantity += product.quantity;
            } else {
              groupedData[product.product._id] = {
                product: product.product,
                quantity: product.quantity,
              };
            }
          });
          setCartData(Object.values(groupedData));
          setTotalAmount(data.cart.totalAmount);
        } else {
          setCartData([]); 
        }
      }
    };
    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("Attempting to remove from cart");
    if (userId && token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await removeFromCart(userId, productId, headers);
      console.log("Response from removeFromCart:", response);
      if (response && response.message === "Product removed from cart") {
        const updatedCartData = cartData
          .map((item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
              } else {
                return null; 
              }
            }
            return item;
          })
          .filter((item) => item !== null); 
        setCartData(updatedCartData); 
        localStorage.setItem("cart", JSON.stringify(updatedCartData)); 
        const cartItemCount = updatedCartData.length;
        localStorage.setItem("cartItems", cartItemCount); 
        await updateCartItemCount(setCartItemCount, cartItemCount);
        window.dispatchEvent(new Event("storage")); 
      }
    }
  };

useEffect(() => {
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    cartData.forEach((item) => {
      totalAmount += item.quantity * item.product.price;
    });
    setTotalAmount(totalAmount.toFixed(2));
  };
  calculateTotalAmount();
}, [cartData]);

  const handleCheckout = () => {
    localStorage.setItem("totalAmount", totalAmount);
    navigate("/checkout");
  };

  return (
    <Container>
      <h1>Shopping Cart</h1>
      {cartData.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => (
              <tr key={index}>
                <td>
                  <a href={`/products/${item.product._id}`}>
                    {item.product.name}
                  </a>
                </td>
                <td>
                  <a href={`/products/${item.product._id}`}>
                    <img
                      src={
                        item.product.images[0].startsWith("uploads/")
                          ? `https://ecommerceapis-ro84.onrender.com/${item.product.images[0]}`
                          : item.product.images[0]
                      }
                      alt={item.product.name}
                      width="70"
                      height="50"
                    />
                  </a>
                </td>
                <td>${item.product.price}</td>
                <td>{item.product.description}</td>
                <td>{item.quantity}</td>
                <td>${(item.quantity * item.product.price).toFixed(2)}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFromCart(item.product._id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h2>Total Amount: ${totalAmount}</h2>
      <Button
        className="mx-2"
        variant="primary"
        onClick={handleCheckout}
        disabled={totalAmount <= 0}
      >
        Checkout
      </Button>
      <Button variant="outline-dark" href="/">
        Start Shopping
      </Button>
    </Container>
  );
};

export default Cart;
