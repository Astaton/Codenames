import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/UserThunks";
import { withRouter } from "react-router";
import { useToasts } from "react-toast-notifications";

import "../css/navbar.css";

const Navbar = props => {
  const { isLoggedIn } = props;

  const { addToast } = useToasts();

  const LoggingOut = async () => {
    try {
      const err = await props.logout();
      if (err === undefined) {
        props.history.push("/");
      } else {
        addToast("Sorry, failed at logging you out. Please try again", {
          appearance: "warning",
          autoDismiss: true
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav id="navbar" className="navbar nav-wrapper red darken-4">
      {isLoggedIn ? (
        <Link to="/onSubmit">
          <button className="btn controls-btn waves-effect waves-dark">
            Go to Game Room
          </button>
        </Link>
      ) : (
        <div></div>
      )}
      <div className="logo-container">
        <h1 id="header-logo" className="header-logo hide-on-med-and-down">
          Codenames
        </h1>
        <h3
          id="header-logo"
          className="header-logo hide-on-large-only hide-on-small-only"
        >
          Codenames
        </h3>
      </div>
      {isLoggedIn ? (
        <div className="btns-right-container">
          <button
            className="controls-btn btn right waves-effect waves-dark"
            onClick={LoggingOut}
          >
            Log Out
          </button>
          <Link to="/userProfile">
            <button className="controls-btn btn right waves-effect waves-dark">
              User Record
            </button>
          </Link>
        </div>
      ) : (
        <div className="btns-right-container">
          <Link to="/auth/register">
            <button className="btn right waves-effect waves-dark teal darken-2">
              Sign Up
            </button>
          </Link>
          <Link to="/auth/login">
            <button className="btn right waves-effect waves-dark teal darken-2">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

const mapStateToProps = state => {
  return {
    isLoggedIn: !state.firebase.auth.isEmpty
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
