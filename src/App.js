import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { checkForAuth } from "./firebase/firebase.utils";

import Login from "./pages/Login";
import "./App.css";
import Add from "./pages/Add";
import Welcome from "./components/Welcome";
import Navbar from "./components/Navbar";
import Verify from "./pages/Verify";
import Discard from "./pages/Discard";
import Edit from "./pages/Edit";
import NotFound from "./components/NotFound";

export const API_URL = "https://us-central1-quizzy-a4b01.cloudfunctions.net/";

function App() {
  const [user, setUser] = useState(null);
  const [link, setLink] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("someQuizzySecret"));
    if (data) {
      checkAuth(data);
    }
    async function checkAuth() {
      const response = await checkForAuth(data.role, data.id);
      if (response?.status === "SUCCESS") {
        setUser(response.data);
        if (response.data.role === "admin") {
          setLink("/verify");
        } else if (response.data.role === "que-user") {
          setLink("/add");
        }
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} setLink={setLink} />
        <Route path="/" exact component={() => <Welcome link={link} />} />
        <Route
          path="/login"
          exact
          render={() => <Login user={user} setUser={setUser} />}
        />
        <Route path="/add" exact render={() => <Add user={user} />} />
        <Route path="/discard" exact render={() => <Discard user={user} />} />
        <Route path="/verify" exact render={() => <Verify user={user} />} />
        <Route
          path="/edit/:id"
          render={({ match }) => {
            return match ? <Edit match={match} user={user} /> : <NotFound />;
          }}
        />
      </div>
    </Router>
  );
}

export default App;
