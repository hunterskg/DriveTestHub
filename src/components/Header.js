import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a
          className="navbar-brand fw-bold fs-4 text-white"
          href="/"
          style={{ textDecoration: "none" }}
        >
          🚗 DriveTestHub
        </a>

        <div className="collapse navbar-collapse justify-content-end">
          {/* Nếu user đã đăng nhập */}
          {user ? (
            <div className="d-flex align-items-center gap-3 text-white">
              <span>
                Xin chào, <strong>{user.fullName}</strong>
              </span>
              <button
                className="btn btn-light btn-sm px-3"
                onClick={onLogout}
              >
                🚪 Đăng xuất
              </button>
            </div>
          ) : (
            /* Nếu chưa đăng nhập */
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-light btn-sm px-3"
                onClick={() => navigate("/login?role=user")}
              >
                👤 User
              </button>
              <button
                className="btn btn-outline-light btn-sm px-3"
                onClick={() => navigate("/login?role=admin")}
              >
                🛠️ Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
