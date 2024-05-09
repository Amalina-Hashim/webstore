import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { makePayment } from "../utils/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, orderId } = location.state || {};
  const [shouldTriggerRefresh, setShouldTriggerRefresh] = useState(true);

  console.log("Location state:", location.state);

  const [paymentInfo, setPaymentInfo] = useState({
    amount: totalAmount || "",
    currency: "usd",
    description: "Ecommerce Order",
    orderId: orderId || "",
    source: "tok_visa",
  });

  useEffect(() => {
    if (totalAmount && orderId) {
      setPaymentInfo((prevPaymentInfo) => ({
        ...prevPaymentInfo,
        amount: totalAmount,
        orderId: orderId,
      }));
    }
  }, [totalAmount, orderId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");

      const cartData = JSON.parse(localStorage.getItem("cart"));

      console.log("Cart Data:", cartData); 

      if (cartData && cartData.length > 0) {
        const items = cartData.map((productItem) => ({
          product: productItem.product, 
          quantity: productItem.quantity,
        }));

        const amountInCents = Math.round(totalAmount * 100);

        const paymentData = {
          amount: amountInCents, 
          currency: "usd",
          description: "Test payment",
          source: "tok_visa",
          orderId: orderId,
          userId: userId,
          items: items,
        };

        console.log("Payment Data:", paymentData);

        await makePayment(paymentData);

        const shouldTriggerRefresh = true;

        if (shouldTriggerRefresh) {
          window.location.href = "/order-status"; 
        } else {
          navigate("/order-status", { replace: true }); 
        }
      } else {
        console.error("Cart data not found.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <h2 className="mb-4">Payment Page</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={parseFloat(paymentInfo.amount).toFixed(2)}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="currency">
          <Form.Label>Currency</Form.Label>
          <Form.Control
            type="text"
            name="currency"
            value={paymentInfo.currency}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={paymentInfo.description}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="orderId">
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            type="text"
            name="orderId"
            value={paymentInfo.orderId}
            readOnly
          />
        </Form.Group>
        <Form.Group controlId="source">
          <Form.Label>Source</Form.Label>
          <Form.Control
            type="text"
            name="source"
            value={paymentInfo.source}
            readOnly
          />
        </Form.Group>
        <Button className="mt-3" variant="primary" type="submit">
          Make Payment
        </Button>
      </Form>
    </Container>
  );
};

export default Payment;
