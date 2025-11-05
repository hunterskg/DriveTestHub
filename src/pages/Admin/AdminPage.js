import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPage({ user, onLogout }) {
  const navigate = useNavigate();

  // 👉 Chuyển đến trang tạo bài thi
  const handleCreateExam = () => {
    navigate("/admin/create-exam");
  };

  // 👉 Chuyển đến trang ngân hàng câu hỏi
  const handleQuestionBank = () => {
    navigate("/admin/questions");
  };

  return (

    <>
      <Header user={user} onLogout={onLogout} />
    <div className="container mt-5">
      <h2 className="text-danger mb-4">Trang Quản Trị (Admin)</h2>
      <p>Xin chào, <strong>{user.fullName}</strong></p>

      <div className="mt-4 d-flex flex-wrap gap-3">
        <button className="btn btn-success" onClick={handleCreateExam}>
          ➕ Tạo bài thi
        </button>

        <button className="btn btn-primary" onClick={handleQuestionBank}>
          📘 Xem ngân hàng câu hỏi
        </button>

        <button className="btn btn-outline-secondary" onClick={onLogout}>
          🚪 Đăng xuất
        </button>
      </div>
    </div>
    </>
  );
}

export default AdminPage;
