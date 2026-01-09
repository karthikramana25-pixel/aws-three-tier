import React from "react";
import { bool } from "prop-types";
import { StyledMenu } from "./Menu.styled";
import { Link, useHistory } from "react-router-dom";

const Menu = ({ open, setOpen, ...props }) => {
  const history = useHistory();

  const isHidden = open ? true : false;
  const tabIndex = isHidden ? 0 : -1;

  const logout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    history.push("/login");
  };

  return (
    <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
      <div>
        <nav>
          <ul>
            <li>
              <Link
                to="/home"
                tabIndex={tabIndex}
                onClick={() => setOpen(false)}
                style={{ outline: "none", border: "none" }}
              >
                <div style={{ paddingBottom: "2em", float: "left" }}>
                  <span aria-hidden="true">🏠</span> Home
                </div>
              </Link>
            </li>

            <li>
              <Link
                to="/db"
                tabIndex={tabIndex}
                onClick={() => setOpen(false)}
                style={{ outline: "none", border: "none" }}
              >
                <div style={{ paddingBottom: "2em", float: "left" }}>
                  <span aria-hidden="true">📋</span> DB Demo
                </div>
              </Link>
            </li>

            <li>
              <button
                onClick={logout}
                tabIndex={tabIndex}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  paddingTop: "2em",
                  float: "left",
                }}
              >
                <span aria-hidden="true">🚪</span> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired,
};

export default Menu;
