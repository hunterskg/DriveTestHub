// src/pages/Admin/QuestionBankPage.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./QuestionBankPage.css";

function QuestionBankPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    image: "",
    correctAnswer: "",
    isCritical: false,
    answers: [{ optionLabel: "A", content: "" }],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");

  const goBackToAdmin = () => navigate("/admin");

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

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      content: "",
      image: "",
      correctAnswer: "",
      isCritical: false,
      answers: [{ optionLabel: "A", content: "" },
      { optionLabel: "B", content: "" }],
    });
    setPreviewImage(null);
    setShowModal(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData(question);
    setPreviewImage(question.image || null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await api.put(`/Questions/${editingQuestion.id}`, formData);
        setMessage("✅ Cập nhật câu hỏi thành công!");
      } else {
        const newQuestion = { id: Date.now().toString(), ...formData };
        await api.post("/Questions", newQuestion);
        setMessage("✅ Thêm câu hỏi thành công!");
      }
      setShowModal(false);
      fetchQuestions();
    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi khi lưu câu hỏi.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa câu hỏi này?")) {
      await api.delete(`/Questions/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const addAnswer = () => {
    const nextLabel = String.fromCharCode(65 + formData.answers.length);
    setFormData({
      ...formData,
      answers: [...formData.answers, { optionLabel: nextLabel, content: "" }],
    });
  };

  const removeAnswer = (index) => {
    if (formData.answers.length <= 2) {
      alert("⚠️ Phải có ít nhất 2 đáp án cho mỗi câu hỏi!");
      return;
    }
    setFormData({
      ...formData,
      answers: formData.answers.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-4 shadow-sm" onClick={goBackToAdmin}>
          ← Quay lại trang quản trị
        </button>

        <h2 className="text-primary fw-bold mb-3">📘 Ngân hàng câu hỏi</h2>

        <button
          className="btn btn-primary rounded-circle shadow-lg position-fixed"
          style={{
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
          onClick={openAddModal}
          title="Thêm câu hỏi mới"
        >
          <i className="bi bi-plus-lg"></i>
        </button>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="table-responsive mt-3 shadow-sm rounded-3 fade-in">
          <table className="table table-hover align-middle table-bordered rounded-3 overflow-hidden">
            <thead className="table-primary">
              <tr className="text-center align-middle">
                <th>#</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Đúng</th>
                <th>Điểm liệt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id}>
                  <td className="text-center fw-bold">{i + 1}</td>
                  <td>{q.content}</td>
                  <td className="text-center">
                    {q.image ? (
                      <img src={q.image} alt="" width="60" />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-center fw-bold text-success">{q.correctAnswer}</td>
                  <td className="text-center">{q.isCritical ? "✅" : "❌"}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
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
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal thêm/sửa */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingQuestion ? "✏️ Chỉnh sửa câu hỏi" : "➕ Thêm câu hỏi mới"}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <label className="form-label">Nội dung</label>
                    <textarea
                      className="form-control mb-3"
                      rows="2"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />

                    <label className="form-label">Hình minh họa (nếu có)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control mb-2"
                      onChange={handleImageChange}
                    />

                    {previewImage && (
                      <div className="text-center mb-3">
                        <img
                          src={previewImage}
                          alt="preview"
                          style={{ maxWidth: "60%", borderRadius: "6px" }}
                        />
                        <div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-2"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData({ ...formData, image: "" });
                            }}
                          >
                            ❌ Xóa ảnh
                          </button>
                        </div>
                      </div>
                    )}

                    <label className="form-label">Đáp án đúng</label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      value={formData.correctAnswer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correctAnswer: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.isCritical}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isCritical: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label">Câu điểm liệt</label>
                    </div>

                    <label className="form-label">Danh sách đáp án</label>
                    {formData.answers.map((ans, index) => (
                      <div key={index} className="input-group mb-2">
                        <span className="input-group-text">{ans.optionLabel}</span>
                        <input
                          className="form-control"
                          value={ans.content}
                          onChange={(e) => {
                            const answers = [...formData.answers];
                            answers[index].content = e.target.value;
                            setFormData({ ...formData, answers });
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
                      className="btn btn-outline-secondary btn-sm mb-3"
                      onClick={addAnswer}
                    >
                      ➕ Thêm đáp án
                    </button>

                    <button type="submit" className="btn btn-primary w-100">
                      {editingQuestion ? "💾 Lưu thay đổi" : "✅ Thêm câu hỏi"}
                    </button>
                  </form>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default QuestionBankPage;
