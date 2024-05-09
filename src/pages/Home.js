import React from "react";
import { Container, Card } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import ProductList from "../components/ProductList";

const Home = () => {
  return (
    <div>
      <Card
        className="bg-dark text-white"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh", // Adjust the height as needed
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
    </div>
  );
};

export default Home;
