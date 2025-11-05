// src/pages/UserExamListPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";

function UserExamListPage( { user, onLogout }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const goBackToUser = () => {
    navigate("/user"); // ✅ Điều hướng không reload trang
  };
  useEffect(() => {
    axios
      .get("http://localhost:9999/Exams")
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách bài thi:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>   
    <Header user={user} onLogout={onLogout} />
     <button className="btn btn-secondary mb-4" onClick={() => goBackToUser()}>
      ← Quay lại trang người dùng
    </button>
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="text-primary fw-bold mb-2">🧾 Danh sách bài thi</h2>
        <p className="text-muted">Chọn bài thi bạn muốn làm nhé!</p>
      </div>

      {exams.length === 0 ? (
        <div className="alert alert-warning text-center">
          Chưa có bài thi nào được tạo.
        </div>
      ) : (
        <div className="row">
          {exams.map((exam) => (
            <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary fw-semibold mb-3">
                    🧠 {exam.title || `Bài thi #${exam.id}`}
                  </h5>
                  <p className="card-text text-muted">
                    <strong>Tổng số câu hỏi:</strong> {exam.questions?.length || 0}
                    <br />
                    <strong>Câu điểm liệt:</strong>{" "}
                    {exam.questions?.filter((q) => q.isCritical).length || 0}
                  </p>

                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => navigate(`/exam/${exam.id}`)}
                  >
                    🚗 Làm bài thi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default UserExamListPage;
