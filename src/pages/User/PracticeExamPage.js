import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";

import { Modal, Button } from "react-bootstrap";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ExamPage.css"; // 👈 tái sử dụng style của ExamPage
import { generateRandomExam } from "../../ultil/randomExam";

const EXAM_DURATION = 19 * 60; // 19 phút

function PracticeExamPage({ user }) {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const timerRef = useRef(null);
  const navigate = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    if (!user) return;

    api
      .get("/Questions")
      .then((res) => {
        const createdExam = generateRandomExam(res.data, user.id);
        setExam(createdExam);
        setStartTime(new Date());
      })
      .catch((err) => console.error("❌ Lỗi tải câu hỏi:", err));
  }, [user]);

  // đếm ngược
  useEffect(() => {
    if (!exam || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [exam, submitted]);

  const handleSelect = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const toggleMark = (qId) => {
    setMarked((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmit = () => {
    if (!exam) return;
    clearInterval(timerRef.current);

    let correct = 0;
    let criticalFail = false;

    exam.questions.forEach((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correct++;
      if (q.isCritical && !isCorrect) criticalFail = true;
    });

    const score = correct;
    const pass = !criticalFail && correct >= 21;

    setResult({ score, correct, total: exam.questions.length, pass });
    setSubmitted(true);
    setShowModal(true);

    const examDetail = {
      id: `${Date.now()}`,
      examId: exam.id,
      userId,
      title: "Tự luyện đề",
      score,
      correctCount: correct,
      totalQuestion: exam.questions.length,
      takeAt: startTime.toLocaleString("vi-VN"),
      endedAt: new Date().toLocaleString("vi-VN"),
      passStatus: pass,
      questions: exam.questions.map((q) => ({
        ...q,
        selectedAnswer: answers[q.id] || "",
        isCorrect: answers[q.id] === q.correctAnswer,
      })),
    };

    api
      .post("/ExamDetails", examDetail)
      .then(() => console.log("✅ Đã lưu kết quả luyện tập"))
      .catch((err) => console.error(err));
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  if (!exam)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
        }}
      >
        <div className="spinner-border text-primary mb-3"></div>
        <p className="text-muted">Đang tạo đề thi...</p>
      </div>
    );

  const q = exam.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / exam.questions.length) * 100;

  return (
    <div
      className="exam-page min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      

      {/* Modal kết quả */}
      <Modal show={showModal} centered>
        <div className="modal-header bg-success text-white">
          <h5 className="modal-title">✅ Kết quả luyện tập</h5>
        </div>
        <div className="modal-body text-center">
          <h4 className="fw-bold text-success">
            Số câu đúng: {result?.correct}/{result?.total}
          </h4>
          <p>Điểm: <strong>{result?.score}</strong></p>
          <p>
            Trạng thái:
            {result?.pass ? (
              <span className="text-success fw-bold"> Đạt ✅</span>
            ) : (
              <span className="text-danger fw-bold"> Không đạt ❌</span>
            )}
          </p>
          <Button
            variant="primary"
            className="w-100 mt-3 rounded-pill"
            onClick={() => {
              setShowModal(false);
              navigate("/user/history");
            }}
          >
            Xem chi tiết bài thi
          </Button>
        </div>
      </Modal>

      <div className="container py-5 flex-grow-1">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0 rounded-4 p-3">
              <h5 className="text-primary fw-bold mb-3 text-center">
                Danh sách câu hỏi
              </h5>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {exam.questions.map((item, i) => {
                  const answered = answers[item.id];
                  const markedQ = marked.includes(item.id);
                  const cls = markedQ
                    ? "btn-warning"
                    : answered
                    ? "btn-success"
                    : "btn-outline-secondary";
                  return (
                    <button
                      key={item.id}
                      className={`btn ${cls} btn-sm rounded-circle`}
                      style={{ width: "38px", height: "38px" }}
                      onClick={() => setCurrentIndex(i)}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="progress mt-4" style={{ height: "10px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="small text-muted mt-1">
                Đã làm: {answeredCount}/{exam.questions.length}
              </p>

              <div
                className={`alert mt-3 py-2 ${
                  timeLeft < 60 ? "alert-danger" : "alert-info"
                }`}
              >
                ⏰ Còn lại: <strong>{formatTime(timeLeft)}</strong>
              </div>

              <button
                className="btn btn-danger w-100 mt-2 rounded-pill"
                onClick={handleSubmit}
              >
                <i className="bi bi-send me-1"></i> Nộp bài
              </button>
            </div>
          </div>

          {/* Nội dung câu hỏi */}
          <div className="col-md-9">
            <div
              className={`card shadow-sm border-0 rounded-4 p-4 ${
                q.isCritical ? "border-danger border-2" : ""
              }`}
            >
              <h5 className="fw-bold">
                Câu {currentIndex + 1}: {q.content}
                {q.isCritical && (
                  <span className="badge bg-danger ms-2">Điểm liệt</span>
                )}
              </h5>

              {q.image && (
                <div className="text-center my-3">
                  <img
                    src={q.image}
                    className="img-fluid rounded shadow-sm"
                    alt="question"
                    style={{ maxWidth: "400px" }}
                  />
                </div>
              )}

              {q.answers.map((a) => (
                <div className="form-check my-2" key={a.id}>
                  <input
                    type="radio"
                    name={q.id}
                    className="form-check-input"
                    checked={answers[q.id] === a.optionLabel}
                    onChange={() => handleSelect(q.id, a.optionLabel)}
                  />
                  <label className="form-check-label">
                    {a.optionLabel}. {a.content}
                  </label>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary rounded-pill"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                >
                  ← Trước
                </button>
                <button
                  className="btn btn-outline-warning rounded-pill"
                  onClick={() => toggleMark(q.id)}
                >
                  {marked.includes(q.id) ? "Bỏ đánh dấu" : "🔖 Đánh dấu"}
                </button>
                <button
                  className="btn btn-outline-secondary rounded-pill"
                  disabled={currentIndex === exam.questions.length - 1}
                  onClick={() => setCurrentIndex((i) => i + 1)}
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
}

export default PracticeExamPage;
