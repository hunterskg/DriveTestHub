import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ===== HEADER ===== */}
      <Header user={null} onLogout={() => {}} />

      {/* ===== BODY ===== */}
      <div className="homepage d-flex flex-column align-items-center justify-content-center text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold text-primary mb-3 animate-fade">
            Chào mừng đến với <span className="brand">DriveTestHub</span>
          </h1>

          <p className="lead text-secondary mb-4">
            Nền tảng giúp bạn <strong>ôn luyện</strong> và{" "}
            <strong>thi thử bằng lái xe A1</strong> dễ dàng và hiệu quả.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
            alt="car"
            width="140"
            className="mb-4 homepage-img"
          />

          <p className="text-muted mb-4">
            Học – Ôn tập – Thi thử – Đánh giá kết quả ngay tại nhà.
          </p>

          <button
            className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow-sm homepage-btn"
            onClick={() => navigate("/login?role=user")}
          >
            🚀 Bắt đầu ôn thi
          </button>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row justify-content-center g-4">
            {/* Thi thử mọi lúc mọi nơi */}
            <div className="col-md-5">
              <div className="feature-card p-4 text-center shadow-sm rounded-4">
                <div className="fs-1 mb-3">🕐</div>
                <h5 className="fw-semibold text-primary mb-2">
                  Thi thử mọi lúc, mọi nơi
                </h5>
                <p className="text-muted mb-0">
                  Tự do luyện tập bài thi mô phỏng trên điện thoại hoặc máy tính, 
                  giúp bạn làm quen với cấu trúc đề thực tế.
                </p>
              </div>
            </div>

            {/* Thống kê kết quả học tập */}
            <div className="col-md-5">
              <div className="feature-card p-4 text-center shadow-sm rounded-4">
                <div className="fs-1 mb-3">📊</div>
                <h5 className="fw-semibold text-primary mb-2">
                  Thống kê kết quả học tập
                </h5>
                <p className="text-muted mb-0">
                  Hệ thống tự động lưu lịch sử làm bài và phân tích kết quả, 
                  giúp bạn theo dõi tiến trình học tập hiệu quả hơn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </>
  );
}

export default HomePage;
