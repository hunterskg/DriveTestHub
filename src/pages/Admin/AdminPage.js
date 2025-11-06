import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminPage.css";
import Footer from "../../components/Footer";

function AdminPage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleCreateExam = () => navigate("/admin/create-exam");
  const handleQuestionBank = () => navigate("/admin/questions");

  const cards = [
    {
      title: "Tạo bài thi",
      icon: "bi bi-plus-circle-fill",
      color: "success",
      desc: "Tạo mới đề thi với danh sách câu hỏi và thời gian làm bài.",
      onClick: handleCreateExam,
    },
    {
      title: "Ngân hàng câu hỏi",
      icon: "bi bi-journal-text",
      color: "primary",
      desc: "Quản lý toàn bộ câu hỏi, thêm – sửa – xóa và phân loại nội dung.",
      onClick: handleQuestionBank,
    },
  ];

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className="admin-container">
        <div className="container text-center">
          <h2 className="admin-title">👑 Trang Quản Trị (Admin)</h2>
          <p className="admin-subtitle">
            Quản lý nội dung, đề thi và ngân hàng câu hỏi trong hệ thống.
          </p>

          <div className="row mt-4 justify-content-center">
            {cards.map((card, idx) => (
              <div key={idx} className="col-md-4 mb-4">
                <div
                  className={`admin-card text-${card.color}`}
                  onClick={card.onClick}
                >
                  <div className="card-body">
                    <div className="admin-icon mb-3">
                      <i className={`${card.icon}`}></i>
                    </div>
                    <h5 className="fw-bold">{card.title}</h5>
                    <p className="text-muted small">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminPage;
