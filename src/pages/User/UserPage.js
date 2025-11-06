import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import "./UserPage.css"; // 👈 thêm file CSS riêng
import Footer from "../../components/Footer";

function UserPage({ user, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      {/* ===== HEADER ===== */}
      <Header user={user} onLogout={onLogout} />

      {/* ===== BODY CONTENT ===== */}
      <div className="userpage-body container py-5 text-center">
        
        <p className="text-muted mb-4">
          Chọn một trong các chức năng bên dưới để bắt đầu.
        </p>

        <div className="row justify-content-center g-4 mt-3">
          {/* CARD 1 - Danh sách bài thi */}
          <div className="col-10 col-sm-6 col-md-4">
            <div
              className="feature-card shadow-sm p-3 border-0"
              onClick={() => navigate("/exams")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3429/3429425.png"
                alt="Exams"
                width="80"
                className="mx-auto mb-2"
              />
              <h5 className="fw-bold text-primary">Danh sách bài thi</h5>
              <p className="text-muted small">
                Xem và luyện tập các đề thi sát hạch.
              </p>
            </div>
          </div>

          {/* CARD 2 - Lịch sử thi */}
          <div className="col-10 col-sm-6 col-md-4">
            <div
              className="feature-card shadow-sm p-3 border-0"
              onClick={() => navigate("/user/history")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/32/32223.png"
                alt="History"
                width="80"
                className="mx-auto mb-2"
              />
              <h5 className="fw-bold text-primary">Lịch sử làm bài</h5>
              <p className="text-muted small">
                Xem kết quả và phân tích các bài thi trước đó.
              </p>
            </div>
          </div>

          {/* CARD 3 - Tự luyện đề ngẫu nhiên */}
          <div className="col-10 col-sm-6 col-md-4">
            <div
              className="feature-card shadow-sm p-3 border-0"
              onClick={() => navigate("/practice")}
            >
              <img
                src="https://cdn4.iconfinder.com/data/icons/language-learning-3/512/practice-study-learning-education-knowledge-512.png"
                alt="Practice"
                width="80"
                className="mx-auto mb-2"
              />
              <h5 className="fw-bold text-primary">Tự luyện đề ngẫu nhiên</h5>
              <p className="text-muted small">
                🧠 Hệ thống tạo ngẫu nhiên đề thi để bạn thử sức mọi lúc.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
    </>
  );
}

export default UserPage;
