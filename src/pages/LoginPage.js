import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./LoginPage.css"; // 👈 Thêm CSS riêng

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role");

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title =
      roleParam === "admin" ? "Admin Login - DriveTestHub" : "User Login - DriveTestHub";
  }, [roleParam]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.get("/User");
      const found = data.find(
        (u) =>
          u.userName === userName &&
          u.password === password &&
          (roleParam === "admin" ? u.role === 1 : u.role === 0)
      );

      if (found) {
        onLogin(found);
        navigate(roleParam === "admin" ? "/admin" : "/user");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến server!");
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="login-card shadow-lg p-4 rounded-4">
        <h2 className="text-center text-primary mb-4 fw-bold">
          {roleParam === "admin" ? "🛠️ Đăng nhập Admin" : "👤 Đăng nhập User"}
        </h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleLogin}>
          {/* USERNAME */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control rounded-pill px-3"
              placeholder="Nhập tên đăng nhập..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-start-pill px-3"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text rounded-end-pill bg-white"
                role="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 mt-2 shadow-sm">
            Đăng nhập
          </button>
        </form>

        {/* REGISTER LINK */}
        {roleParam === "user" && (
          <div className="text-center mt-3">
            <small>
              Chưa có tài khoản?{" "}
              <span
                className="text-primary text-decoration-underline fw-semibold"
                role="button"
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </span>
            </small>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="text-center mt-4">
          <button
            className="btn btn-link text-secondary text-decoration-none"
            onClick={() => navigate("/")}
          >
            ⬅️ Quay lại Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
