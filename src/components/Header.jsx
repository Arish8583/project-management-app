import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/auth/auth";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header style={{
      background: "#282c34",
      padding: "1rem",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>JiraLite 🚀</h2>
      <nav>
        <Link to="/dashboard" style={{ color: "#fff", marginRight: "1rem" }}>Dashboard</Link>
        
        {currentUser ? (
          <>
            <span style={{ marginRight: "1rem" }}>{currentUser.name}</span>
            <button
              onClick={handleLogout}
              style={{ background: "red", color: "#fff", border: "none", padding: "0.5rem" }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "#fff" }}>Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
