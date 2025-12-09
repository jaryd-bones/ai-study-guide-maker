import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PersonCircle } from "react-bootstrap-icons";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className="navbar-left">
        <Link to="/dashboard" className={styles.navbarBrand}>
          Study Guide Maker
        </Link>
      </div>

      <div className={styles.navbarRight}>
        {user ? (
          <>
            <span className="d-flex gap-2 align-items-center d-none d-sm-flex">
              <PersonCircle size={25} className="align-self-center" />
              {user.email}
            </span>

            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className={styles.navbarLoginLink} to="/login">
              Login
            </Link>

            <Link className="btn btn-primary" to="/register">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
