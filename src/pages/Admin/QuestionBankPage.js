// src/pages/Admin/QuestionBankPage.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


 
function QuestionBankPage({ user, onLogout }) {
  const navigate = useNavigate();

  const goBackToAdmin = () => {
    navigate("/admin"); // ✅ Điều hướng không reload trang
  };
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    image: "",
    correctAnswer: "",
    isCritical: false,
    answers: [{ optionLabel: "A", content: "" }],
  });
  const [message, setMessage] = useState("");

  // 📌 Lấy danh sách câu hỏi
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/Questions");
      setQuestions(data);
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
      setMessage("❌ Không thể tải danh sách câu hỏi.");
    }
  };

  // 📌 Xử lý thêm hoặc cập nhật câu hỏi
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingQuestion) {
        await api.put(`/Questions/${editingQuestion.id}`, formData);
        setMessage("✅ Cập nhật câu hỏi thành công!");
      } else {
        const newQuestion = {
          id: Date.now().toString(),
          ...formData,
        };
        await api.post("/Questions", newQuestion);
        setMessage("✅ Thêm câu hỏi mới thành công!");
      }

      setFormData({
        content: "",
        image: "",
        correctAnswer: "",
        isCritical: false,
        answers: [{ optionLabel: "A", content: "" }],
      });
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi khi lưu câu hỏi.");
    }
  };

  // 📌 Xóa câu hỏi
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      try {
        await api.delete(`/Questions/${id}`);
        setQuestions(questions.filter((q) => q.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 📌 Chỉnh sửa câu hỏi
  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData(question);
  };

  // 📌 Thêm đáp án
  const addAnswer = () => {
    const nextLabel = String.fromCharCode(65 + formData.answers.length);
    setFormData({
      ...formData,
      answers: [...formData.answers, { optionLabel: nextLabel, content: "" }],
    });
  };

  // 📌 Xóa đáp án
  const removeAnswer = (index) => {
    const newAnswers = formData.answers.filter((_, i) => i !== index);
    setFormData({ ...formData, answers: newAnswers });
  };

  return (
    <>
    <Header user={user} onLogout={onLogout} />
      <button className="btn btn-secondary mb-4" onClick={() => goBackToAdmin()}>
        ← Quay lại trang quản trị
      </button>
    <div className="container mt-4">
      
      <h2 className="text-primary mb-4">📘 Ngân hàng câu hỏi</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Form thêm/sửa câu hỏi */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5>{editingQuestion ? "✏️ Chỉnh sửa câu hỏi" : "➕ Thêm câu hỏi mới"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nội dung câu hỏi</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Đáp án đúng</label>
              <input
                type="text"
                className="form-control"
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value.toUpperCase() })
                }
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.isCritical}
                onChange={(e) =>
                  setFormData({ ...formData, isCritical: e.target.checked })
                }
              />
              <label className="form-check-label">Câu điểm liệt</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Danh sách đáp án</label>
              {formData.answers.map((ans, index) => (
                <div key={index} className="input-group mb-2">
                  <span className="input-group-text">{ans.optionLabel}</span>
                  <input
                    type="text"
                    className="form-control"
                    value={ans.content}
                    onChange={(e) => {
                      const newAnswers = [...formData.answers];
                      newAnswers[index].content = e.target.value;
                      setFormData({ ...formData, answers: newAnswers });
                    }}
                    required
                  />
                  {formData.answers.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeAnswer(index)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={addAnswer}
              >
                ➕ Thêm đáp án
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {editingQuestion ? "Cập nhật" : "Thêm câu hỏi"}
            </button>
          </form>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <h4 className="mb-3">📋 Danh sách câu hỏi</h4>
      {questions.length === 0 ? (
        <p>Chưa có câu hỏi nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nội dung</th>
                <th>Đáp án đúng</th>
                <th>Điểm liệt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id}>
                  <td>{index + 1}</td>
                  <td>{q.content}</td>
                  <td>{q.correctAnswer}</td>
                  <td>{q.isCritical ? "✅" : "❌"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(q)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(q.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

export default QuestionBankPage;
