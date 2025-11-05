import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleCreateExam = () => {
    // Chuyển hướng sang trang tạo bài thi
    navigate("/admin/create-exam");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-danger mb-4">Trang Quản Trị (Admin)</h2>
      <p>Xin chào, {user.fullName}</p>

      <div className="mt-4 d-flex gap-3">
        <button className="btn btn-success" onClick={handleCreateExam}>
          ➕ Tạo bài thi
        </button>

        <button className="btn btn-outline-secondary" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
