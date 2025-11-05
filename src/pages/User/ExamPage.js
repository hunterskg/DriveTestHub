import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ExamPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy userId từ session
  const userId = user?.id;

  useEffect(() => {
    axios
      .get(`http://localhost:9999/Exams/${id}`)
      .then((response) => setExam(response.data))
      .catch((error) => console.error("Lỗi khi tải bài thi:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelect = (qId, optionLabel) => {
    setAnswers({ ...answers, [qId]: optionLabel });
  };

  const handleSubmit = async () => {
    if (!exam || !userId) {
      alert("Bạn cần đăng nhập để làm bài thi!");
      navigate("/login?role=user");
      return;
    }

    let correct = 0;
    let criticalWrong = false;

    const updatedQuestions = exam.questions.map((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) correct++;
      if (q.isCritical && !isCorrect) criticalWrong = true;

      return { ...q, selectedAnswer: selected || "", isCorrect };
    });

    const score = ((correct / exam.questions.length) * 10).toFixed(1);
    const pass = !criticalWrong && score >= 8;

    setResult({ correct, score, pass, criticalWrong });
    setSubmitted(true);

    // ✅ Lưu toàn bộ lịch sử bài thi vào ExamDetails
    const examDetail = {
      id: `${Date.now()}`,
      examId: exam.id,
      userId, // 👈 lấy từ session
      title: exam.title || `Bài thi #${exam.id}`,
      score: Number(score),
      correctCount: correct,
      totalQuestion: exam.questions.length,
      takeAt: exam.takeAt,
      endedAt: new Date().toLocaleTimeString(),
      passStatus: pass,
      questions: updatedQuestions,
    };

    try {
      await axios.post("http://localhost:9999/ExamDetails", examDetail);
    } catch (error) {
      console.error("❌ Lỗi khi lưu lịch sử:", error);
    }

    // ✅ Cập nhật lại điểm trong bảng Exams
    try {
      await axios.patch(`http://localhost:9999/Exams/${exam.id}`, {
        score: Number(score),
        correctCount: correct,
        endedAt: new Date().toLocaleTimeString(),
        passStatus: pass,
      });
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Exams:", error);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">Không tìm thấy bài thi.</div>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/exams")}>
          ⬅️ Quay lại danh sách
        </button>
      </div>
    );

  // ✅ Hiển thị giao diện bài thi
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">
          🧠 {exam.title || `Bài thi #${exam.id}`}
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/exams")}>
          ⬅️ Quay lại danh sách
        </button>
      </div>

      {!submitted ? (
        <>
          {exam.questions.map((q, index) => (
            <div key={q.id} className={`card mb-3 shadow-sm ${q.isCritical ? "border-danger" : ""}`}>
              <div className="card-body">
                <h5 className="card-title">
                  Câu {index + 1}: {q.content}
                  {q.isCritical && <span className="badge bg-danger ms-2">Điểm liệt</span>}
                </h5>
                {q.image && (
                  <img src={q.image} alt="Question" className="img-fluid rounded my-2" style={{ maxWidth: "400px" }} />
                )}
                {q.answers.map((a) => (
                  <div className="form-check" key={a.optionLabel}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={q.id}
                      id={`${q.id}-${a.optionLabel}`}
                      value={a.optionLabel}
                      checked={answers[q.id] === a.optionLabel}
                      onChange={() => handleSelect(q.id, a.optionLabel)}
                    />
                    <label className="form-check-label" htmlFor={`${q.id}-${a.optionLabel}`}>
                      {a.optionLabel}. {a.content}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center mt-4">
            <button
              className="btn btn-success px-4"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
            >
              Nộp bài
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <h3 className={result.pass ? "text-success" : "text-danger"}>
            {result.pass ? "🎉 Chúc mừng! Bạn ĐẠT!" : "❌ Rất tiếc, bạn KHÔNG ĐẠT!"}
          </h3>
          <p className="fs-5">
            Kết quả: <strong>{result.correct}</strong> / {exam.questions.length} câu đúng
          </p>
          <p className="fs-5">
            Điểm: <strong>{result.score}/10</strong>
          </p>
          {result.criticalWrong && (
            <p className="text-danger">⚠️ Bạn sai câu điểm liệt nên bị loại.</p>
          )}
          <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/exams")}>
            🔁 Quay lại danh sách bài thi
          </button>
        </div>
      )}
    </div>
  );
}

export default ExamPage;
