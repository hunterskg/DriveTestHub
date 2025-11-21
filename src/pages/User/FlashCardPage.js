import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";


function FlashCardPage({ user, onLogout }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        axios.get("http://localhost:9999/Questions").then((res)=>{
            setQuestions(res.data);
        }).catch((err)=>{
            console.error("❌ Lỗi khi tải câu hỏi:", err);
        }).finally(()=>{
            setLoading(false);
        });
    }, []);

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        const correct = questions[currentIndex].correctAnswer === answer;
        setIsCorrect(correct);
        setShowResult(true);
    };

    const nextQuestion = () => {
        setSelectedAnswer("");
        setShowResult(false);
        setIsCorrect(null);
        setCurrentIndex((prev) => prev + 1);
    };      

    const prevQuestion = () => {
        setSelectedAnswer("");
        setShowResult(false);
        setIsCorrect(null);
        setCurrentIndex((prev) => prev - 1);
    };
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }
    if (questions.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h4 className="text-danger">Không có câu hỏi nào để hiển thị!</h4>
            </div>
        );
    }
    const current = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-primary fw-bold">📘 Flashcard Ôn Tập</h3>
          <p className="text-muted mb-0">
            Câu {currentIndex + 1}/{questions.length}
          </p>
        </div>

        {/* Thanh tiến trình */}
        <div className="progress mb-4" style={{ height: "10px" }}>
          <div
            className="progress-bar bg-primary"
            role="progressbar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Câu hỏi */}
        <div
          className={`card shadow-lg p-4 ${
            current.isCritical ? "border-danger" : ""
          }`}
        >
          <h5 className="mb-3">
            Câu {currentIndex + 1}: {current.content}
            {current.isCritical && (
              <span className="badge bg-danger ms-2">Điểm liệt</span>
            )}
          </h5>

          {current.image && (
            <img
              src={current.image}
              alt="question"
              className="img-fluid rounded mb-3"
              style={{ maxWidth: "400px" }}
            />
          )}

          {current.answers.map((a) => (
            <button
              key={a.optionLabel}
              className={`btn w-100 text-start mb-2 ${
                selectedAnswer === a.optionLabel
                  ? isCorrect
                    ? "btn-success"
                    : "btn-danger"
                  : "btn-outline-primary"
              }`}
              onClick={() => handleAnswer(a.optionLabel)}
              disabled={showResult}
            >
              <strong>{a.optionLabel}.</strong> {a.content}
            </button>
          ))}

          {/* Hiển thị kết quả */}
          {showResult && (
            <div
              className={`alert mt-3 ${
                isCorrect ? "alert-success" : "alert-danger"
              }`}
            >
              {isCorrect ? "✅ Chính xác!" : "❌ Sai rồi!"}
              {!isCorrect && (
                <p className="mb-0 mt-2">
                  👉 Đáp án đúng là:{" "}
                  <strong>{current.correctAnswer}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Nút điều hướng */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
          >
            ⬅️ Trước
          </button>
          <button
            className="btn btn-primary"
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
          >
            Tiếp ➡️
          </button>
        </div>
      </div>
    </>
  );
}
export default FlashCardPage;

