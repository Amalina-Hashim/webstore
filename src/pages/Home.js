import React, { useState } from "react";
import { Container, Card, Toast } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import ProductList from "../components/ProductList";

const Home = () => {
  const [showToast, setShowToast] = useState(true);

  const toggleShowToast = () => setShowToast(!showToast);

  return (
    <div>
      <Card
        className="bg-dark text-white"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Container>
          <Card.Body>
            <Card.Title>Welcome to our Ecommerce Store</Card.Title>
            <Card.Text>
              Discover the latest trends and shop your favorite products!
            </Card.Text>
          </Card.Body>
        </Container>
      </Card>
      <Container>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/favorites"
            element={<ProductList favoritesOnly={true} />}
          />
        </Routes>
      </Container>
      <Toast
        show={showToast}
        onClose={toggleShowToast}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Toast.Header closeButton>
          <strong className="mr-auto">Notice</strong>
        </Toast.Header>
        <Toast.Body>
          Product data may take 1-2 minutes to load as it's hosted on Render's
          free tier.
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default Home;
