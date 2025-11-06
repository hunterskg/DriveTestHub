import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./RegisterPage.css"; // 👈 Thêm CSS mới

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState({password: false, confirmPassword: false});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const { data: users } = await api.get("/User");
      const existed = users.find(
        (u) => u.userName.toLowerCase() === formData.userName.toLowerCase()
      );

      if (existed) {
        setError("Tên đăng nhập đã tồn tại!");
        return;
      }

      const maxId = users.length > 0 ? Math.max(...users.map((u) => Number(u.id))) : 0;
      const newUser = {
        id: String(maxId + 1),
        ...formData,
        role: 0,
      };

      await api.post("/User", newUser);
      setSuccess("🎉 Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login?role=user"), 1500);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="register-page d-flex justify-content-center align-items-center vh-100">
      <div className="register-card shadow-lg p-4 rounded-4">
        <h2 className="text-center text-primary mb-4 fw-bold">📝 Đăng ký tài khoản</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleRegister}>
          {/* Tên đăng nhập */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Tên đăng nhập</label>
            <input
              type="text"
              name="userName"
              className="form-control rounded-pill px-3"
              placeholder="Nhập tên đăng nhập..."
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                className="form-control rounded-start-pill px-3"
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text rounded-end-pill bg-white"
                role="button"
                onClick={() => setShowPassword({...showPassword, password: !showPassword.password})}
              >
                <i className={`bi ${showPassword.password ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control rounded-start-pill px-3"
                placeholder="Nhập lại mật khẩu..."
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="input-group-text rounded-end-pill bg-white"
                role="button"
                onClick={() => setShowPassword({...showPassword, confirmPassword: !showPassword.confirmPassword})}
              >
                <i className={`bi ${showPassword.confirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          {/* Họ và tên */}
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              className="form-control rounded-pill px-3"
              placeholder="Nhập họ và tên..."
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 mt-2 shadow-sm">
            Đăng ký
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Đã có tài khoản?{" "}
            <span
              className="text-primary text-decoration-underline fw-semibold"
              role="button"
              onClick={() => navigate("/login?role=user")}
            >
              Đăng nhập
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
