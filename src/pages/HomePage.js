// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HEADER ===== */}
      <Header user={null} onLogout={() => {}} />

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
      <Footer />
    </>
  );
}

export default HomePage;
