import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-gradient text-center py-4 mt-5">
      <div className="container">
        <p className="mb-2 text-light small">
          © {new Date().getFullYear()}{" "}
          <span className="fw-semibold">DriveTestHub</span> — Hệ thống thi bằng lái xe.
        </p>

        <div className="d-flex justify-content-center gap-3 fs-5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            <i className="bi bi-github"></i>
          </a>
          <a
            href="https://hunterskg.itch.io/spending-challenge-ssg"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            <i className="bi bi-envelope"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
