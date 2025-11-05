// src/pages/User/ExamReviewPage.js
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
        console.error("Lỗi khi tải dữ liệu bài thi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p>Đang tải dữ liệu bài thi...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Không tìm thấy bài thi!</h4>
      </div>
    );
  }

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className="container my-5">
        {/* --- Thông tin bài thi --- */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3 className="text-primary">{exam.title}</h3>
            <p className="mb-1">
              🕒 Bắt đầu: <strong>{exam.takeAt}</strong>
            </p>
            <p className="mb-1">
              ✅ Số câu đúng: <strong>{exam.correctCount}</strong> /{" "}
              {exam.totalQuestion}
            </p>
            <p className="mb-1">
              🎯 Điểm: <strong>{exam.score}</strong>
            </p>
            <p className="mb-1">
              Trạng thái:{" "}
              <span
                className={`badge ${
                  exam.passStatus ? "bg-success" : "bg-danger"
                }`}
              >
                {exam.passStatus ? "Đạt" : "Không đạt"}
              </span>
            </p>
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={() => navigate("/user/history")}
            >
              ⬅ Quay lại lịch sử
            </button>
          </div>
        </div>

        {/* --- Danh sách câu hỏi --- */}
        {exam.questions && exam.questions.length > 0 ? (
          exam.questions.map((q, index) => (
            <div key={q.id} className="card mb-3">
              <div className="card-body">
                <h5>
                  Câu {index + 1}: {q.content}
                </h5>

                {q.image && (
                  <img
                    src={q.image}
                    alt="question"
                    className="img-fluid rounded my-2"
                    style={{ maxWidth: "300px" }}
                  />
                )}

                <ul className="list-group">
                  {q.answers.map((ans) => {
                    const isCorrect = ans.optionLabel === q.correctAnswer;
                    const isSelected = q.selectedAnswer === ans.optionLabel;

                    let itemClass = "list-group-item";
                    if (isSelected && isCorrect)
                      itemClass += " list-group-item-success"; // đúng
                    else if (isSelected && !isCorrect)
                      itemClass += " list-group-item-danger"; // sai
                    else if (isCorrect) itemClass += " list-group-item-info"; // đáp án đúng

                    return (
                      <li key={ans.optionLabel} className={itemClass}>
                        <strong>{ans.optionLabel}.</strong> {ans.content}
                        {isSelected && (
                          <span className="badge bg-dark ms-2">Đã chọn</span>
                        )}
                        {isCorrect && (
                          <span className="badge bg-success ms-2">
                            Đáp án đúng
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Không có câu hỏi nào trong bài thi.</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default ExamReviewPage;
