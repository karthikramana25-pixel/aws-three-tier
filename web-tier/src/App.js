import React, { useState, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import FocusLock from "react-focus-lock";

import { useOnClickOutside } from "./hooks";
import { GlobalStyles } from "./global";
import { theme } from "./theme";
import { Burger, Menu } from "./components";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./components/Home/Home";
import DatabaseDemo from "./components/DatabaseDemo/DatabaseDemo";

/* ===============================
   AUTH HELPER (simple & local)
================================ */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* ===============================
   PRIVATE ROUTE
================================ */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

function App() {
  const [open, setOpen] = useState(false);
  const node = useRef();
  const menuId = "main-menu";

  useOnClickOutside(node, () => setOpen(false));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <Router>
        <div ref={node}>
          <FocusLock disabled={!open}>
            {/* Burger menu visible only after login */}
            {isAuthenticated() && (
              <>
                <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
                <Menu open={open} setOpen={setOpen} id={menuId} />
              </>
            )}

            <Switch>
              {/* Public Routes */}
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />

              {/* Protected Routes */}
              <PrivateRoute path="/db" component={DatabaseDemo} />
              <PrivateRoute path="/home" component={Home} />

              {/* Default Route */}
              <Route path="/">
                {isAuthenticated() ? <Redirect to="/home" /> : <Redirect to="/login" />}
              </Route>
            </Switch>
          </FocusLock>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
