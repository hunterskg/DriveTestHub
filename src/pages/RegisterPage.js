import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        confirmPassword: "",
        fullName: "",
    });
    const [showPassword, setShowPassword] = useState(false);
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
                id: String(maxId + 1), // 👈 ID là chuỗi (ví dụ: "1", "2", "3")
                ...formData,
                role: 0, // role cũng dạng string nếu muốn đồng bộ
            };

            await api.post("/User", newUser);
            setSuccess("Đăng ký thành công! Đang chuyển hướng...");
            setTimeout(() => navigate("/login?role=user"), 1500);
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center text-primary mb-4">📝 Đăng ký tài khoản</h2>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="userName"
                            className="form-control"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">Mật khẩu</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="input-group-text"
                                role="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </span>
                        </div>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="mb-3 position-relative">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="input-group-text"
                                role="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Đăng ký
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>
                        Đã có tài khoản?{" "}
                        <span
                            className="text-primary text-decoration-underline"
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
