import React, { useState } from "react";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateExamPage() {
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [criticalCount, setCriticalCount] = useState(5);
  const [message, setMessage] = useState("");

  const getRandomItems = (arr, count) =>
    arr.sort(() => 0.5 - Math.random()).slice(0, count);

  const handleCreateExam = async () => {
    try {
      const { data: questions } = await api.get("/Questions");

      const critical = questions.filter((q) => q.isCritical);
      const normal = questions.filter((q) => !q.isCritical);

      if (critical.length < criticalCount) {
        setMessage("Không đủ số lượng câu điểm liệt!");
        return;
      }

      const selectedQuestions = [
        ...getRandomItems(critical, criticalCount),
        ...getRandomItems(normal, totalQuestions - criticalCount),
      ];

      const newExam = {
        id: Date.now().toString(),
        score: 0,
        totalQuestion: selectedQuestions.length,
        correctCount: 0,
        takeAt: new Date().toLocaleTimeString(),
        endedAt: null,
        userId: 1, // ID admin
        passStatus: false,
      };

      await api.post("/Exams", newExam);

      for (const q of selectedQuestions) {
        const detail = {
          id: `${newExam.id}_${q.id}`,
          selectedAnswer: "",
          isCorrect: false,
          examsId: newExam.id,
          questionsId: q.id,
        };
        await api.post("/ExamDetails", detail);
      }

      setMessage("✅ Tạo bài thi thành công!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi khi tạo bài thi!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Tạo bài thi ngẫu nhiên</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="mb-3">
        <label className="form-label">Tổng số câu:</label>
        <input
          type="number"
          className="form-control"
          value={totalQuestions}
          onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Số câu điểm liệt:</label>
        <input
          type="number"
          className="form-control"
          value={criticalCount}
          onChange={(e) => setCriticalCount(parseInt(e.target.value))}
        />
      </div>

      <button className="btn btn-primary w-100" onClick={handleCreateExam}>
        Tạo bài thi
      </button>
    </div>
  );
}

export default CreateExamPage;
