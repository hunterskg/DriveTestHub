// src/pages/UserExamListPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function UserExamListPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Lấy danh sách bài thi từ db.json (JSON Server)
    axios
      .get("http://localhost:9999/Exams")
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải danh sách bài thi:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Danh sách bài thi</h2>

      {exams.length === 0 ? (
        <div className="alert alert-warning">Chưa có bài thi nào.</div>
      ) : (
        <div className="list-group">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="list-group-item list-group-item-action mb-2"
            >
              <h5 className="mb-1">{exam.title || `Bài thi #${exam.id}`}</h5>
              <p className="mb-1">
                <strong>Số câu hỏi:</strong> {exam.questions?.length || 0}
              </p>
              <button className="btn btn-outline-primary">
                Làm bài thi
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserExamListPage;
