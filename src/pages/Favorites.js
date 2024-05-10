import React from "react";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import FavoriteList from "../components/FavoriteList";

const Favorites = () => {
  return (
    <div className= "mt-4">
      <Container>
        <Routes>
          <Route path="/" element={<FavoriteList />} />
        </Routes>
      </Container>
    </div>
  );
};

export default Favorites;
