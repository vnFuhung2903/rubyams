import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const logoUrl = "https://ext.same-assets.com/3727013250/311005913.png";

const menuItems = [
  "TRANG CHỦ",
  "GIẢNG VIÊN",
  "SINH VIÊN",
  "CỔNG THÔNG TIN",
  "LIÊN HỆ VÀ PHẢN HỒI"
];

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Thêm menuItems mới
  const navItems = [
    { label: "Học tập", path: "/timetable" },
    { label: "Đăng kí học tập", path: "/register-course" },
    { label: "Đăng kí lớp", path: "/register-class" }
  ];

  return (
    <div style={{ background: '#c12e40', color: '#fff', paddingTop: 12, paddingBottom: 24, boxShadow: '0 2px 8px #0001' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={logoUrl} alt="Logo" style={{ height: 54, marginRight: 16 }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '24px', letterSpacing: 0.2 }}>ĐẠI HỌC BÁCH KHOA HÀ NỘI</div>
              <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', opacity: 0.93 }}>Hệ thống Quản trị Đại học Trực tuyến</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ borderRadius: 8, background: 'rgba(255,255,255,0.15)', padding: 4, fontWeight: 500, cursor: 'pointer', fontSize: 15 }}>VI</div>
            {user ? (
              <>
                <span style={{
                  background: "#fff",
                  color: "#c12e40",
                  borderRadius: 8,
                  padding: "4px 16px",
                  fontWeight: 600,
                  fontSize: 15
                }}>{user}</span>
                <button
                  onClick={logout}
                  style={{
                    padding: '4px 16px',
                    background: '#fff',
                    color: '#c12e40',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer'
                  }}
                >Đăng xuất</button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: '4px 22px',
                  background: '#fff',
                  color: '#c12e40',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >ĐĂNG NHẬP</button>
            )}
          </div>
        </div>
        <nav style={{ marginTop: 24 }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            gap: 32
          }}>
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  letterSpacing: 0.05,
                  padding: "4px 12px",
                  borderRadius: 8,
                  transition: "background 0.2s",
                  userSelect: "none"
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
