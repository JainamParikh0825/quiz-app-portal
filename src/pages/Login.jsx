import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { loginWithFirestore } from "../firebase/firebase.utils";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";

export default function Login({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState(false);
  const [currentRole, setCurrentRole] = useState("admin");

  const login = async (e) => {
    e.preventDefault();
    setError(false);
    if (email && password && role) {
      console.log("executed")
      const response = await loginWithFirestore(role, email, password);
      console.log(response)

      if (response?.status === "SUCCESS") {
        const { data } = response;
        localStorage.setItem("someQuizzySecret", JSON.stringify(data));
        setUser(data);
      } else {
        setError(true);
      }
    }
  };

  const toggleRole = (event) => {
    event.target.value === "admin" ? setRole("admin") : setRole("que-user");
    setCurrentRole(event.target.value);
  };

  const btn =
    currentRole === "admin" ? (
      <Button
        variant="dark"
        type="submit"
        // onClick={() => setRole("admin")}
        style={{ margin: "20px 0" }}
      >
        PUBLISH QUESTIONS
      </Button>
    ) : (
      <Button
        variant="primary"
        type="submit"
        style={{ margin: "20px 0" }}
        // onClick={() => setRole("que-user")}
      >
        DRAFT QUESTIONS
      </Button>
    );

  return (
    <div className="login">
      {user ? (
        <>
          {user.role === "admin" ? (
            <Redirect to="/verify" />
          ) : (
            <Redirect to="/add" />
          )}
        </>
      ) : (
        <div className="login-form">
          <h1 className="heading">Do You Know</h1>
          <Form onSubmit={login}>
            <Form.Group>
              {/* <div className="radio-btns">
                <label htmlFor="admin">Admin</label>
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  onChange={toggleRole}
                  defaultChecked={true}
                />
                <label htmlFor="developer">Developer</label>
                <input
                  type="radio"
                  id="developer"
                  name="role"
                  value="developer"
                  onChange={toggleRole}
                />
              </div> */}
              <div className="role-btns">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="role"
                    id="admin"
                    value="admin"
                    onChange={toggleRole}
                    defaultChecked={true}
                  />
                  <label class="form-check-label" for="inlineRadio1">
                    Admin
                  </label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    name="role"
                    id="developer"
                    value="developer"
                    onChange={toggleRole}
                  />
                  <label class="form-check-label" for="inlineRadio2">
                    Developer
                  </label>
                </div>
              </div>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Text>
              Please Enter Email ID And Password Provided By Do You Know Team
            </Form.Text>
            {/* <Button
              variant="primary"
              type="submit"
              style={{ margin: "20px 0" }}
              // onClick={() => setRole("que-user")}
            >
              I want to DRAFT Quiz Questions
            </Button>
            <br />
            <Button
              variant="dark"
              type="submit"
              // onClick={() => setRole("admin")}
              style={{ margin: "20px 0" }}
            >
              I want to PUBLISH Quiz Questions
            </Button> */}
            {btn}
          </Form>

          {error ? (
            <Alert variant="danger">Invalid Credential or Role</Alert>
          ) : null}
        </div>
      )}
    </div>
  );
}
