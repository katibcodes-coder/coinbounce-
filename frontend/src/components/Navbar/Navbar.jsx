
import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSignout = async () => {
    try {
      await signout();
      dispatch(resetUser());
      closeMenu();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.activeStyle : ""}`;

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          className={styles.logo}
          onClick={closeMenu}
        >
          CoinBounce
        </NavLink>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`${styles.navContent} ${menuOpen ? styles.menuOpen : ""}`}>
          <div className={styles.navLinks}>
            <NavLink to="/" end className={linkClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/crypto" className={linkClass} onClick={closeMenu}>
              Cryptocurrencies
            </NavLink>

            <NavLink to="/blogs" className={linkClass} onClick={closeMenu}>
              Blogs
            </NavLink>

            <NavLink to="/submit" className={linkClass} onClick={closeMenu}>
              Submit a blog
            </NavLink>
          </div>

          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <button
                type="button"
                className={styles.signOutButton}
                onClick={handleSignout}
              >
                Sign Out
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={styles.logInButton}
                  onClick={closeMenu}
                >
                  Log In
                </NavLink>

                <NavLink
                  to="/signup"
                  className={styles.signUpButton}
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.separator} />
    </>
  );
}

export default Navbar;
