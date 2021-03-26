import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Navbar({ user, setUser, setLink }) {
  return (
    <div className="navbar-custom">
      <Nav>
        <Nav.Link
          href="/"
          style={{
            color: "aquamarine",
            fontWeight: "800",
            fontSize: "1.2rem",
          }}
        >
          Do You Know
        </Nav.Link>
        {!user ? (
          <Link to="/login" style={{ display: "flex", alignItems: "center" }}>
            <Nav.Item href="/login">Login</Nav.Item>
          </Link>
        ) : (
          <NavDropdown title={user.email}>
            <NavDropdown.Item
              eventKey="logout"
              onClick={() => {
                setUser(null);
                setLink(null);
                localStorage.removeItem("someQuizzySecret");
              }}
            >
              <Link to="/">Logout</Link>
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </Nav>
    </div>
  );
}
