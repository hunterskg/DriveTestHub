import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/Admin/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import CreateExamPage from "./pages/Admin/CreateExamPage";
import UserExamListPage from "./pages/User/UserExamListPage";
import UserPage from "./pages/User/UserPage";
import QuestionBankPage from "./pages/Admin/QuestionBankPage";
import ExamPage from "./pages/User/ExamPage";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHistoryPage from "./pages/User/UserHistoryPage";
import ExamReviewPage from "./pages/User/ExamReviewPage";

function App() {
  const [user, setUser] = useState(null);

  // Khi app khởi động → lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

// 👉 Các route trong app
function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ lưu lại session
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ xóa khi logout
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        path="/admin"
        element={
          user && user.role === 1 ? (
            <AdminPage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/create-exam"
        element={
          user && user.role === 1 ? (
            <CreateExamPage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/exams" element={<UserExamListPage user={user} onLogout={handleLogout} />} />
      <Route path="/user" element={<UserPage user={user} onLogout={handleLogout} />} />
      <Route path="/exam" element={<ExamPage user={user} onLogout={handleLogout} />} />
      <Route path="/exam/:id" element={<ExamPage user={user} onLogout={handleLogout} />} />
      <Route
        path="/admin/questions"
        element={
          user && user.role === 1 ? (
            <QuestionBankPage user={user} onLogout={handleLogout}/>
          ) : (
      <Navigate to="/" />
    )
  }
/>
<Route
  path="/user/history"
  element={
    user ? (
      <UserHistoryPage user={user} onLogout={handleLogout} />
    ) : (
      <Navigate to="/login?role=user" />
    )
  }
/>
<Route
  path="/exam/review/:examId"
  element={<ExamReviewPage user={user} onLogout={handleLogout} />}
/>


    </Routes>
  );
}

export default App;
