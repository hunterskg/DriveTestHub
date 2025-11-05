import React, { useState } from "react";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";

function CreateExamPage({ user, onLogout }) {
  const [totalQuestions, setTotalQuestions] = useState(25);
  const [criticalCount, setCriticalCount] = useState(5);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const getRandomItems = (arr, count) =>
    arr.sort(() => 0.5 - Math.random()).slice(0, count);

  const handleCreateExam = async () => {
    try {
      const { data: questions } = await api.get("/Questions");

      const critical = questions.filter((q) => q.isCritical);
      const normal = questions.filter((q) => !q.isCritical);

      if (critical.length < criticalCount) {
        setMessage("❌ Không đủ số lượng câu điểm liệt trong ngân hàng đề thi!");
        return;
      }

      // 👉 Lấy ngẫu nhiên các câu hỏi
      const selectedQuestions = [
        ...getRandomItems(critical, criticalCount),
        ...getRandomItems(normal, totalQuestions - criticalCount),
      ];

      // 👉 Tạo bài thi mới (có chứa danh sách câu hỏi)
      const newExam = {
        id: Date.now().toString(),
        title: title,
        score: 0,
        totalQuestion: selectedQuestions.length,
        correctCount: 0,
        takeAt: new Date().toLocaleTimeString(),
        endedAt: null,
        userId: 1, // ID admin
        passStatus: false,
        questions: selectedQuestions, // 👈 Thêm danh sách câu hỏi
      };

      await api.post("/Exams", newExam);

     

      setMessage("Tạo bài thi thành công!");
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tạo bài thi!");
    }
  };

  return (
    <>
    <Header user={user} onLogout={onLogout} />
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Tạo bài thi ngẫu nhiên</h2>

      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Tiêu đề bài thi:</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      

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
        🚗 Tạo bài thi
      </button>
    </div>
    </>
  );
}

export default CreateExamPage;
