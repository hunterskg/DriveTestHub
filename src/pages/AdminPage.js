// src/pages/AdminPage.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPage({ user, onLogout }) {
  return (
    <div className="container mt-5">
      <h2 className="text-danger">Trang Quản Trị (Admin)</h2>
      <p>Xin chào, {user.fullName}</p>
      <button className="btn btn-outline-secondary" onClick={onLogout}>
        Đăng xuất
      </button>
    </div>
  );
}

export default AdminPage;
