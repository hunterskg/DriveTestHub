// src/pages/UserPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";

function UserPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HEADER ===== */}
      <Header user={user} onLogout={onLogout} />
      {/* ===== BODY CONTENT ===== */}
      <div className="container py-5 text-center">
        <h2 className="text-success mb-3">Chào mừng {user.fullName} 👋</h2>
        <p className="text-muted">
          Chọn một trong các chức năng bên dưới để bắt đầu.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/exams")}
          >
            📚 Xem danh sách bài thi
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/user/history")}
          >
            📜 Lịch sử thi
          </button>

          <button
            className="btn btn-outline-secondary px-4"
            onClick={onLogout}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-light text-center py-3 border-top mt-5">
        <p className="mb-1 text-muted">
          © {new Date().getFullYear()} <strong>DriveTestHub</strong> — Hệ thống
          thi bằng lái xe.
        </p>
      </footer>
    </>
  );
}

export default UserPage;
