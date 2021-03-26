import React from "react";
import Typewriter from "typewriter-effect";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Welcome({ link }) {
  return (
    <div
      className="welcome"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90vw",
        height: "90vh",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <h1>
        <Typewriter
          style={{ fontSize: "2rem" }}
          options={{
            strings: [
              "Welcome To Do You Know Quiz Portal",
              "A Portal To Manage All Do You Know Quiz Questions",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </h1>
      {link ? (
        <Button variant="outline-primary" size="lg">
          <Link to={link}>
            {link === "/add" ? "Add Question" : "Verify Questions"}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
