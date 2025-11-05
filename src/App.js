import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/Admin/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import CreateExamPage from "./pages/Admin/CreateExamPage";
import UserExamListPage from "./pages/UserExamListPage";
import UserPage from "./pages/UserPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} />
    </Router>
  );
}

// 👉 Tách riêng phần route để có thể dùng useNavigate
function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = (userData) => setUser(userData);

  // ✅ Khi logout: xóa user + quay lại trang chủ
  const handleLogout = () => {
    setUser(null);
    navigate("/"); // <-- tự động quay lại HomePage
  };

  return (
    <Routes>
      {/* Trang chủ */}
      <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />

      {/* Trang đăng nhập */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Trang admin */}
      <Route
        path="/admin"
        element={
          user && user.role === 1 ? (
            <AdminPage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" /> // nếu chưa đăng nhập thì về HomePage
          )
        }
      />

      {/* Trang user */}
      
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/create-exam" element={<CreateExamPage />} /> 
      <Route path="/exams" element={<UserExamListPage />} />
      <Route path="/user" element={<UserPage user={user} onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
