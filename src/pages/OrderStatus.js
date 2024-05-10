import React, { useState, useEffect } from "react";
import { getOrdersByUserId } from "../utils/api";
import { Container, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom"; 

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUserId(userId);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Order Status</h2>
      {orders.map((order) => (
        <Card className="mb-3" key={order.orderId}>
          <Card.Body>
            <Card.Title>Order ID: {order._id}</Card.Title>
            <ListGroup variant="flush">
              {order.items.map((item, index) => (
                <Card key={index} style={{ marginBottom: "10px" }}>
                  <Card.Body>
                    <Link to={`/products/${item.product._id}`}>
                      <Card.Title>{item.product.name}</Card.Title>
                    </Link>
                    <Card.Text>Category: {item.product.category}</Card.Text>
                    <Card.Text>Price: ${item.product.price}</Card.Text>
                    <Link to={`/products/${item.product._id}`}>
                      <Card.Img
                        src={
                          item.product.images[0].startsWith("uploads/")
                            ? `https://ecommerceapis-ro84.onrender.com/${item.product.images[0]}`
                            : item.product.images[0]
                        }
                        alt={item.product.name}
                        style={{ width: "150px", height: "100px" }}
                      />
                    </Link>
                  </Card.Body>
                </Card>
              ))}
              <ListGroup.Item>
                <strong>Shipped:</strong> {order.shipped ? "Yes" : "No"}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default OrderStatus;
