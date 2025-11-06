import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

function UserHistoryPage({ user, onLogout }) {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const goBackToUser = () => navigate("/user");

  useEffect(() => {
    if (!user) return;
    api
      .get(`/ExamDetails?userId=${user.id}`)
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Lỗi tải lịch sử thi:", err));
  }, [user]);

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold mb-0">📜 Lịch sử làm bài thi</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={goBackToUser}
            style={{ borderRadius: "10px" }}
          >
            ← Quay lại
          </button>
        </div>

        {exams.length === 0 ? (
          <div className="alert alert-warning shadow-sm text-center">
            Bạn chưa làm bài thi nào.
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Tên bài thi</th>
                      <th>Số câu đúng</th>
                      <th>Điểm</th>
                      <th>Thời gian</th>
                      <th>Kết quả</th>
                      <th>Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams
                      .slice()
                      .reverse()
                      .map((exam, index) => (
                        <tr key={exam.id}>
                          <td>{index + 1}</td>
                          <td>{exam.title || `Bài thi #${exam.id}`}</td>
                          <td>
                            {exam.correctCount}/{exam.totalQuestion}
                          </td>
                          <td className="fw-bold">{exam.score}</td>
                          <td className="small text-muted">
                            {exam.takeAt} - {exam.endedAt || "Chưa kết thúc"}
                          </td>
                          <td>
                            <span
                              className={`badge px-3 py-2 ${
                                exam.passStatus ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {exam.passStatus ? "Đỗ" : "Trượt"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm rounded-pill"
                              onClick={() =>
                                navigate(`/exam/review/${exam.id}`)
                              }
                            >
                              Xem lại
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}

export default UserHistoryPage;
