import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { userLogin } from "../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit called"); 
    e.preventDefault();
    try {
      const response = await userLogin(formData);
      console.log("Login Response:", response);

      if (response && response.token && response.userId) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("userName", response.userName);

        window.location.href = "/";
      } else {
        console.error("Token or user ID not found in login response");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Button className="mt-2" variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
