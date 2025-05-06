import React from "react";

const timetableData = [
  {
    stt: 1,
    subject: { name: "Nhập môn an toàn thông tin", code: "157534 - IT4015 (LT+BT)", link: "#" },
    type: "Offline",
    score: "",
    schedule: "Sáng T5, Tiết 1-4, TC-412, Tuần: 24-31,33-41, Kỳ AB",
    absent: 0,
    teacher: { name: "Bùi Trọng Tùng", link: "#" },
    feedback: "=",
  },
  {
    stt: 2,
    subject: { name: "Technical Writing and Presentation", code: "157509 - IT2030 (LT+BT)", link: "#" },
    type: "Offline",
    score: "",
    schedule: "Sáng T3, Tiết 1-4, D5-501, Tuần: 24-31,33-41, Kỳ AB",
    absent: 0,
    teacher: { name: "Phạm Hùng Vượng", link: "#" },
    feedback: "=",
  },
  {
    stt: 3,
    subject: { name: "Nhập môn Học máy và khai phá dữ liệu", code: "157520 - IT3190 (LT+BT)", link: "#" },
    type: "Offline",
    score: "",
    schedule: "Chiều T3, Tiết 1-4, TC-204, Tuần: 24-31,33-41, Kỳ AB",
    absent: 0,
    teacher: { name: "Nguyễn Thị Kim Anh", link: "#" },
    feedback: "=",
  },
  {
    stt: 4,
    subject: { name: "Làm việc nhóm và kỹ năng giao tiếp", code: "157513 - IT4480 (LT+BT)", link: "#" },
    type: "Offline",
    score: "",
    schedule: "Sáng T2, Tiết 1-3, D3-406, Tuần: 24-31,33-41, Kỳ AB",
    absent: 0,
    teacher: { name: "Lê Đức Trung", link: "#" },
    feedback: "=",
  },
  {
    stt: 5,
    subject: { name: "Kiến trúc máy tính", code: "159380 - IT3030 (LT+BT)", link: "#" },
    type: "Offline",
    score: "",
    schedule: "Chiều T4, Tiết 3-6, D5-503, Tuần: 24-31,33-41, Kỳ AB",
    absent: 5,
    teacher: { name: "Nguyễn Kim Khánh", link: "#" },
    feedback: "=",
  },
];

export default function TimetablePage() {
  return (
    <div className="container" style={{ background: "#fff", borderRadius: 16, margin: "32px auto", padding: 32, boxShadow: "0 2px 12px #25324e0a" }}>
      <h2 style={{ color: "#c12e40", marginBottom: 24 }}>Thời khoá biểu</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: "#f1f1f7" }}>
              <th style={thStyle}>STT</th>
              <th style={thStyle}>Học phần</th>
              <th style={thStyle}>Hình thức giảng dạy</th>
              <th style={thStyle}>Điểm</th>
              <th style={thStyle}>Lịch học</th>
              <th style={thStyle}>Vắng</th>
              <th style={thStyle}>Giảng viên</th>
              <th style={thStyle}>Phản hồi của SV</th>
            </tr>
          </thead>
          <tbody>
            {timetableData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{row.stt}</td>
                <td style={tdStyle}>
                  <a href={row.subject.link} style={{ color: "#c12e40", fontWeight: 600, textDecoration: "underline" }}>{row.subject.name}</a>
                  <div style={{ color: "#888", fontSize: 13 }}>{row.subject.code}</div>
                </td>
                <td style={tdStyle}>{row.type}</td>
                <td style={tdStyle}>{row.score}</td>
                <td style={tdStyle}>{row.schedule}</td>
                <td style={tdStyle}>{row.absent}</td>
                <td style={tdStyle}>
                  <a href={row.teacher.link} style={{ color: "#1976d2", textDecoration: "underline" }}>{row.teacher.name}</a>
                </td>
                <td style={tdStyle}>{row.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "2px solid #c12e40",
  textAlign: "left",
  color: "#c12e40",
  fontWeight: 700,
  background: "#f9f9fb"
};

const tdStyle: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top"
}; 