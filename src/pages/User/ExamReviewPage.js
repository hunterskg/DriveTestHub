import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function ExamReviewPage({ user, onLogout }) {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(`/ExamDetails/${examId}`);
        setExam(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu bài thi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <div className="spinner-border text-primary mb-3"></div>
        <p className="text-muted">Đang tải dữ liệu bài thi...</p>
      </div>
    );

  if (!exam)
    return (
      <div
        className="container mt-5 text-center"
        style={{
          background: "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <h4 className="text-danger">Không tìm thấy bài thi!</h4>
      </div>
    );

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      {/* ===== HEADER ===== */}
      <Header user={user} onLogout={onLogout} />

      {/* ===== MAIN CONTENT ===== */}
      <div className="container py-5 flex-grow-1">
        {/* --- Thông tin bài thi --- */}
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body">
            <h3 className="text-primary fw-bold mb-3">{exam.title}</h3>
            <div className="row g-2 small text-muted">
              <div className="col-md-6">
                🕒 Bắt đầu: <strong>{exam.takeAt}</strong>
              </div>
              <div className="col-md-6">
                ✅ Số câu đúng:{" "}
                <strong>
                  {exam.correctCount}/{exam.totalQuestion}
                </strong>
              </div>
              <div className="col-md-6">
                🎯 Điểm: <strong>{exam.score}</strong>
              </div>
              <div className="col-md-6">
                Trạng thái:{" "}
                <span
                  className={`badge px-3 py-2 ${
                    exam.passStatus ? "bg-success" : "bg-danger"
                  }`}
                >
                  {exam.passStatus ? "Đỗ" : "Trượt"}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-secondary mt-3 rounded-pill"
              onClick={() => navigate("/user/history")}
            >
              ⬅ Quay lại lịch sử
            </button>
          </div>
        </div>

        {/* --- Danh sách câu hỏi --- */}
        {exam.questions && exam.questions.length > 0 ? (
          exam.questions.map((q, index) => (
            <div
              key={q.id}
              className="card shadow-sm border-0 rounded-4 mb-4"
            >
              <div className="card-body">
                <h5 className="fw-bold mb-2">
                  Câu {index + 1}: {q.content}
                  {q.isCritical && (
                    <span className="badge bg-danger ms-2">Điểm liệt</span>
                  )}
                </h5>

                {q.image && (
                  <div className="text-center my-3">
                    <img
                      src={q.image}
                      alt="question"
                      className="img-fluid rounded shadow-sm"
                      style={{
                        maxWidth: "400px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}

                <ul className="list-group">
                  {q.answers.map((ans) => {
                    const isCorrect = ans.optionLabel === q.correctAnswer;
                    const isSelected = q.selectedAnswer === ans.optionLabel;

                    let itemClass =
                      "list-group-item d-flex justify-content-between align-items-center";
                    if (isSelected && isCorrect)
                      itemClass += " list-group-item-success";
                    else if (isSelected && !isCorrect)
                      itemClass += " list-group-item-danger";
                    else if (isCorrect)
                      itemClass += " list-group-item-info";

                    return (
                      <li key={ans.optionLabel} className={itemClass}>
                        <div>
                          <strong>{ans.optionLabel}.</strong> {ans.content}
                        </div>
                        <div>
                          {isSelected && (
                            <span className="badge bg-dark ms-2">Đã chọn</span>
                          )}
                          {isCorrect && (
                            <span className="badge bg-success ms-2">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center">
            Không có câu hỏi nào trong bài thi.
          </p>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}

export default ExamReviewPage;
