import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError("");
      navigate("/timetable");
    } else {
      setError("Sai tài khoản hoặc mật khẩu! (admin/admin)");
    }
  };

  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #c12e40 0%, #f1f1f7 100%)"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "40px 32px",
          borderRadius: 16,
          boxShadow: "0 4px 24px #25324e18",
          minWidth: 340,
          display: "flex",
          flexDirection: "column",
          gap: 18
        }}
      >
        <h2 style={{ color: "#c12e40", textAlign: "center", marginBottom: 12 }}>Đăng nhập hệ thống</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16
          }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16
          }}
        />
        {error && <div style={{ color: "#c12e40", fontWeight: 500, textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: 8,
            background: "#c12e40",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            marginTop: 8
          }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
} 