import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();
 const handleLogoClick = () => {
    if (!user) {
      navigate("/"); 
    } else if (user.role === 1) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark header-gradient shadow-sm">
      <div className="container">
         <span
          className="navbar-brand fw-bold fs-4 text-white"
          onClick={handleLogoClick}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          🚗 DriveTestHub
        </span>

        <div className="collapse navbar-collapse justify-content-end">
          {user ? (
            <div className="d-flex align-items-center gap-3 text-white">
              <span className="user-name">
                Xin chào, <strong>{user.fullName}</strong>
              </span>
              <button
                className="btn btn-light btn-sm px-3 logout-btn"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light btn-sm px-3"
                onClick={() => navigate("/login?role=user")}
              >
                <i className="bi bi-person-fill me-1"></i> User
              </button>
              <button
                className="btn btn-outline-light btn-sm px-3"
                onClick={() => navigate("/login?role=admin")}
              >
                <i className="bi bi-gear-fill me-1"></i> Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
