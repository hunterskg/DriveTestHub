import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function UserHistoryPage({ user, onLogout }) {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        // Lấy tất cả bài thi của user hiện tại
        api
            .get(`/ExamDetails?userId=${user.id}`)
            .then((res) => setExams(res.data))
            .catch((err) => console.error("Lỗi tải lịch sử thi:", err));
    }, [user]);

    return (
        <>
            <Header user={user} onLogout={onLogout} />
            <div className="container mt-5">
                <h2 className="text-primary mb-4">📜 Lịch sử làm bài thi</h2>

                {exams.length === 0 ? (
                    <div className="alert alert-warning">Bạn chưa làm bài thi nào.</div>
                ) : (
                    <table className="table table-bordered table-striped">
                        <thead className="table-light">
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
                            {exams.map((exam, index) => (
                                <tr key={exam.id}>
                                    <td>{index + 1}</td>
                                    <td>{exam.title || `Bài thi #${exam.id}`}</td>
                                    <td>
                                        {exam.correctCount}/{exam.totalQuestion}
                                    </td>
                                    <td>{exam.score}</td>
                                    <td>
                                        {exam.takeAt} - {exam.endedAt || "Chưa kết thúc"}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${exam.passStatus ? "bg-success" : "bg-danger"
                                                }`}
                                        >
                                            {exam.passStatus ? "Đậu" : "Rớt"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => navigate(`/exam/review/${exam.id}`)}
                                        >
                                            Xem lại
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default UserHistoryPage;
