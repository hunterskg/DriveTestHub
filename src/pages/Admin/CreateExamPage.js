import React, { useState, useEffect } from "react";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import "./CreateExamPage.css";

function CreateExamPage({ user, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [startId, setStartId] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/Questions");
      const sorted = data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setQuestions(sorted);
    } catch (error) {
      console.error("❌ Lỗi khi tải câu hỏi:", error);
      setMessage("Không thể tải danh sách câu hỏi!");
    }
  };

  const handleCreateExam = async () => {
    try {
      if (!startId) {
        setMessage("⚠️ Vui lòng chọn câu hỏi bắt đầu!");
        return;
      }

      const startIndex = questions.findIndex((q) => q.id === startId);
      if (startIndex === -1) {
        setMessage("❌ Không tìm thấy câu hỏi bắt đầu!");
        return;
      }

      // 👉 Lấy 25 câu bắt đầu từ ID chọn
      const selectedQuestions = questions.slice(startIndex, startIndex + 25);
      if (selectedQuestions.length < 25) {
        setMessage("⚠️ Không đủ 25 câu từ câu hỏi này!");
        return;
      }

      const newExam = {
        id: Date.now().toString(),
        title: title || `Bài thi từ câu ${startId}`,
        totalQuestion: selectedQuestions.length,
        questions: selectedQuestions,
      };

      await api.post("/Exams", newExam);
      setMessage("✅ Tạo bài thi thành công!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi khi tạo bài thi!");
    }
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <div className="exam-create-container">
        <div className="card shadow-lg border-0 p-4 rounded-4 bg-white">
          <h2 className="text-primary fw-bold mb-4 text-center">
            🧾 Tạo bài thi theo thứ tự ID
          </h2>

          {message && (
            <div
              className={`alert ${
                message.includes("✅")
                  ? "alert-success"
                  : message.includes("⚠️")
                  ? "alert-warning"
                  : "alert-danger"
              } text-center`}
            >
              {message}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Tiêu đề bài thi:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bài thi..."
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Chọn câu hỏi bắt đầu:</label>
            <select
              className="form-select"
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
            >
              <option value="">-- Chọn ID bắt đầu --</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {`#${q.id} - ${q.content.slice(0, 40)}${
                    q.content.length > 40 ? "..." : ""
                  }`}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex flex-column gap-3">
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleCreateExam}
            >
              🚗 Tạo bài thi
            </button>

            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => navigate("/admin")}
            >
              ⬅ Quay lại trang quản trị
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateExamPage;
