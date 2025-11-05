import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="bg-light text-center py-3 border-top mt-5">
      <p className="mb-1 text-muted">
        © {new Date().getFullYear()} <strong>DriveTestHub</strong> — Hệ thống thi bằng lái xe.
      </p>
      <small className="text-secondary">
        Liên hệ hỗ trợ:{" "}
        <a href="mailto:support@drivetesthub.com">support@drivetesthub.com</a>
      </small>
    </footer>
  );
}

export default Footer;
