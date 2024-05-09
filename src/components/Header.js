import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { updateCartItemCount } from "../utils/cartUtils";
import { userLogout } from "../utils/api";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems) {
        setCartItemCount(parseInt(storedCartItems));
      }
    }, []);

   useEffect(() => {
     console.log("cartItemCount changed:", cartItemCount);
   }, [cartItemCount]);

  useEffect(() => {
    const checkLoggedInStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (token) {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkLoggedInStatus();
    window.addEventListener("storage", checkLoggedInStatus);
    return () => {
      window.removeEventListener("storage", checkLoggedInStatus);
    };
  }, []);

  useEffect(() => {
    const checkCartItemCount = () => {
      updateCartItemCount(setCartItemCount, true);
    };

    checkCartItemCount();

    window.addEventListener("storage", checkCartItemCount);

    return () => {
      window.removeEventListener("storage", checkCartItemCount);
    };
  }, []);

useEffect(() => {
  const updateCartCount = () => {
    const newCount = parseInt(localStorage.getItem("cartItems") || "0");
    setCartItemCount(newCount);
  };

  window.addEventListener("cartUpdated", updateCartCount);

  updateCartCount();

  return () => {
    window.removeEventListener("cartUpdated", updateCartCount);
  };
}, []);

  const handleLogout = async () => {
    try {
      await userLogout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Ecommerce Site
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/products/category/men">
                Men
              </Nav.Link>
              <Nav.Link as={Link} to="/products/category/women">
                Women
              </Nav.Link>
              <Nav.Link as={Link} to="/products/category/kids">
                Kids
              </Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/profile">
                    {user ? `Hello, ${user.username}` : ""}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/favorites">
                    Favorites
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <Nav.Link as={Link} to="/cart">
                    <FaShoppingCart size={20} />
                    <CartItemCount count={cartItemCount} />
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

const CartItemCount = ({ count }) => {
  console.log("Rendering CartItemCount with count:", count);
  return (
    <Badge pill bg="danger">
      {count}
    </Badge>
  );
};

export default Header;
