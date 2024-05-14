import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { getUserInfo, updateUserProfile } from "../utils/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isProfileUpdated, setIsProfileUpdated] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      console.log("Fetched user info:", userInfo);
      setUser(userInfo.user);
      if (userInfo.user.username) {
        setNewName(userInfo.user.username); 
      }
      setNewEmail(userInfo.user.email || "");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  fetchUserInfo();
}, []);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
    setIsProfileUpdated(false); 
  };

  const handleEmailChange = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const value = e.target.value;
    if (isSubmitting && !emailRegex.test(value)) {
      console.error("Invalid email format");
    } else {
      setNewEmail(value);
      setIsProfileUpdated(false);
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setIsProfileUpdated(false); 
  };

 const handleProfileUpdate = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);
   try {
     
     const updatedUserInfo = await updateUserProfile({
       username: newName,
       email: newEmail,
       password: newPassword,
     });

   
     setUser(updatedUserInfo.user);

     
     const isUpdated =
       newName !== updatedUserInfo.user.username ||
       newEmail !== updatedUserInfo.user.email ||
       newPassword !== ""; 

     
     setIsProfileUpdated(!isUpdated);

     
     setNewName(updatedUserInfo.user.username || "");
     setNewEmail(updatedUserInfo.user.email || "");
     setNewPassword(""); 
   } catch (error) {
     console.error("Error updating user profile:", error);
   }
 };

  return (
    <>
      <Container>
        <h2 className="mt-4 mb-4">Profile</h2>
        <Row>
          <Col md={8}>
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group as={Row} controlId="formName">
                <Form.Label column sm={3}>
                  Name:
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="mt-2"
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    placeholder={user.username || "Username"}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formEmail">
                <Form.Label column sm={3}>
                  Email:
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="mt-2"
                    type="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                    placeholder={!user.email ? "Email" : ""}
                  />
                  {newEmail && !emailRegex.test(newEmail) && (
                    <Form.Text className="text-danger">
                      Invalid email format
                    </Form.Text>
                  )}
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPassword">
                <Form.Label column sm={3}>
                  Password:
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    className="mt-2"
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                  />
                </Col>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={isProfileUpdated}
              >
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Link to="/order-status" className="btn btn-secondary">
              View Orders
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
