// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HEADER ===== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="/">
            🚗 DriveTestHub
          </a>

          <div className="collapse navbar-collapse justify-content-end">
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
          </div>
        </div>
      </nav>

      {/* ===== BODY ===== */}
      <div className="container py-5 text-center">
        <h1 className="mb-3 text-primary fw-bold">
          Chào mừng đến với DriveTestHub
        </h1>
        <p className="lead text-muted mb-4">
          Hệ thống giúp bạn ôn luyện và thi thử bằng lái xe B1, B2, A1 dễ dàng.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
          alt="car"
          width="120"
          className="mb-3"
        />
        <p className="text-muted">
          Học – Ôn tập – Thi thử – Đánh giá kết quả ngay tại nhà.
        </p>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-light text-center py-3 border-top mt-5">
        <p className="mb-1 text-muted">
          © {new Date().getFullYear()} <strong>DriveTestHub</strong>
        </p>
      </footer>
    </>
  );
}

export default HomePage;
