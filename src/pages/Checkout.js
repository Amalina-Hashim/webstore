import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getUserCart } from "../utils/api";

const Checkout = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderId, setOrderId] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
    console.log("OrderId:", orderId, "Total Amount:", totalAmount);
    const amount = totalAmount;
    navigate("/payment", { state: { orderId, totalAmount } });
  };

  useEffect(() => {
    const fetchCartData = async () => {
      const userId = localStorage.getItem("userId");
      const response = await getUserCart(userId);
      if (response && response.cart && response.cart.products) {
        const groupedData = {};
        response.cart.products.forEach((product) => {
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
        const total = Object.values(groupedData).reduce((acc, item) => {
          return acc + item.quantity * item.product.price;
        }, 0);
        setTotalAmount(total);
      }
    };
    fetchCartData();
    const generatedOrderId = uuidv4();
    setOrderId(generatedOrderId);
  }, []);

  return (
    <Container>
      <h1 className="my-4">Checkout</h1>
      <h2 className="my-4">Order ID: {orderId}</h2>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Enter first name"
          />
        </Form.Group>
        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter last name"
          />
        </Form.Group>
        <Form.Group controlId="streetAddress" className="mb-3">
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            value={streetAddress}
            onChange={(event) => setStreetAddress(event.target.value)}
            placeholder="Enter street address"
          />
        </Form.Group>
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city"
          />
        </Form.Group>
        <Form.Group controlId="state" className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="Enter state"
          />
        </Form.Group>
        <Form.Group controlId="zipCode" className="mb-3">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            value={zipCode}
            onChange={(event) => setZipCode(event.target.value)}
            placeholder="Enter zip code"
          />
        </Form.Group>
        <Button variant="secondary" className="mx-3" href="/cart">
          Back to Cart
        </Button>
        <Button variant="primary" type="submit" className="mx-2">
          Proceed to Payment
        </Button>
      </Form>
      <h2 className="my-4">Order Summary</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartData.map((item, index) => (
            <tr key={index}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>${(item.quantity * item.product.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2 className="my-4">Total Amount: ${totalAmount.toFixed(2)}</h2>
    </Container>
  );
};

export default Checkout;
