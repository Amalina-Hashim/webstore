import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userSignup, userLogin } from "../utils/api"; 
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userSignup(formData);
      console.log(response);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        console.log("Token stored in local storage:", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        await userLogin(formData);
        console.log("User logged in after signup");
        navigate("/");
        window.location.reload();
      } else {
        console.error("Token not found in signup response");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
          {emailError && (
            <Form.Text className="text-danger">{emailError}</Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formPassword">
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
          Sign Up
        </Button>
      </Form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
