import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import "./UserExamListPage.css"; // 👈 Thêm CSS gradient & card hover
import Footer from "../../components/Footer";

function UserExamListPage({ user, onLogout }) {
  const [exams, setExams] = useState([]);
  const [examDetails, setExamDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goBackToUser = () => navigate("/user");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, detailRes] = await Promise.all([
          axios.get("http://localhost:9999/Exams"),
          axios.get("http://localhost:9999/ExamDetails"),
        ]);
        setExams(examRes.data);
        setExamDetails(detailRes.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách bài thi hoặc lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const getUserLatestAttempt = (examId) => {
    const attempts = examDetails
      .filter((d) => d.examId === examId && d.userId === user?.id)
      .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt));
    return attempts[0] || null;
  };

  const checkInProgress = (examId) => {
    const key = `exam_progress_${user?.id}_${examId}`;
    const data = localStorage.getItem(key);
    if (!data) return false;
    try {
      const parsed = JSON.parse(data);
      return parsed && parsed.remainingTime > 0;
    } catch {
      return false;
    }
  };

  const handleContinueExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const handleRestartExam = (examId) => {
    const key = `exam_progress_${user?.id}_${examId}`;
    localStorage.removeItem(key);
    navigate(`/exam/${examId}`);
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      {/* 🌈 Background gradient full screen */}
      <div className="examlist-page d-flex flex-column min-vh-100 py-5">
        <div className="container flex-grow-1">
          <button
            className="btn btn-outline-secondary mb-4 rounded-pill px-4"
            onClick={goBackToUser}
          >
            ← Quay lại trang người dùng
          </button>

          <div className="text-center mb-5">
            <h2 className="text-primary fw-bold mb-2">🧾 Danh sách bài thi</h2>
            <p className="text-muted">Chọn bài thi bạn muốn làm hoặc xem lại kết quả.</p>
          </div>

          {exams.length === 0 ? (
            <div className="alert alert-warning text-center">
              Chưa có bài thi nào được tạo.
            </div>
          ) : (
            <div className="row">
              {exams.map((exam) => {
                const latest = getUserLatestAttempt(exam.id);
                const inProgress = checkInProgress(exam.id);

                return (
                  <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card exam-card shadow-lg h-100 border-0">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-primary fw-semibold mb-3">
                          🧠 {exam.title || `Bài thi #${exam.id}`}
                        </h5>

                        <p className="card-text text-muted mb-3">
                          <strong>Tổng số câu hỏi:</strong> {exam.questions?.length || 0}
                          <br />
                          <strong>Câu điểm liệt:</strong>{" "}
                          {exam.questions?.filter((q) => q.isCritical).length || 0}
                        </p>

                        {inProgress ? (
                          <div className="alert alert-warning py-2 small mb-3">
                            <p className="mb-1 fw-semibold text-dark">🕒 Bài thi đang làm dở!</p>
                          </div>
                        ) : latest ? (
                          <div className="alert alert-info py-2 small mb-3">
                            <p className="mb-1">
                              <strong>Kết quả gần nhất:</strong>{" "}
                              <span
                                className={
                                  latest.passStatus
                                    ? "text-success fw-semibold"
                                    : "text-danger fw-semibold"
                                }
                              >
                                {latest.passStatus ? "Đạt ✅" : "Không đạt ❌"}
                              </span>
                            </p>
                            <p className="mb-1">
                              <strong>Điểm:</strong> {latest.score}/10
                            </p>
                            <p className="mb-1">
                              <strong>Nộp bài lúc:</strong> {latest.takeAt}
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted small fst-italic mb-3">
                            Chưa làm bài thi này.
                          </p>
                        )}

                        <div className="mt-auto d-flex gap-2">
                          {inProgress ? (
                            <>
                              <button
                                className="btn btn-success flex-fill rounded-pill"
                                onClick={() => handleContinueExam(exam.id)}
                              >
                                ▶️ Tiếp tục
                              </button>
                              <button
                                className="btn btn-outline-danger flex-fill rounded-pill"
                                onClick={() => handleRestartExam(exam.id)}
                              >
                                🔁 Làm lại
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-success flex-fill rounded-pill"
                              onClick={() => handleRestartExam(exam.id)}
                            >
                              🚗 {latest ? "Làm lại bài thi" : "Làm bài thi"}
                            </button>
                          )}

                          {latest && !inProgress && (
                            <button
                              className="btn btn-outline-primary flex-fill rounded-pill"
                              onClick={() => navigate(`/exam/review/${latest.id}`)}
                            >
                              👀 Xem lại
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserExamListPage;
