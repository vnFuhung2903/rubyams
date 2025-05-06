import React, { useState } from "react";

const initialCourses = [
  { code: "EM3130", name: "Kinh tế lượng", date: "4/1/2022", status: "Thành công", credits: 3 },
  { code: "EM3140", name: "Kinh tế quốc tế", date: "4/1/2022", status: "Thành công", credits: 2 },
  { code: "EM3190", name: "Hành vi của tổ chức", date: "4/1/2022", status: "Thành công", credits: 2 },
  { code: "EM3417", name: "Quản trị sản xuất (BTL)", date: "4/1/2022", status: "Thành công", credits: 3 },
  { code: "EM4130", name: "Kinh tế đầu tư", date: "4/1/2022", status: "Thành công", credits: 3 },
  { code: "EM4617", name: "Kinh tế vận hành hệ thống điện", date: "4/1/2022", status: "Thành công", credits: 3 },
  { code: "EM4736", name: "Kế toán quản trị", date: "4/1/2022", status: "Thành công", credits: 3 },
  { code: "PE2201", name: "Bóng đá 1", date: "4/1/2022", status: "Thành công", credits: 0 },
  { code: "PE2501", name: "Cầu lông 1", date: "4/1/2022", status: "Thành công", credits: 0 },
  { code: "PE2502", name: "Cầu lông 2", date: "4/1/2022", status: "Thành công", credits: 0 },
  { code: "PE2601", name: "Chạy", date: "4/1/2022", status: "Thành công", credits: 0 },
  { code: "SSH1141", name: "Lịch sử Đảng cộng sản Việt Nam", date: "4/1/2022", status: "Thành công", credits: 2 },
  { code: "SSH1151", name: "Tư tưởng Hồ Chí Minh", date: "4/1/2022", status: "Thành công", credits: 2 },
];

export default function RegisterCoursePage() {
  const [courses, setCourses] = useState(initialCourses);
  const [selected, setSelected] = useState<number[]>([]);
  const [input, setInput] = useState("");

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  const handleCheck = (idx: number) => {
    setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
  };

  const handleDelete = () => {
    setCourses(courses.filter((_, idx) => !selected.includes(idx)));
    setSelected([]);
  };

  const handleAdd = () => {
    if (!input.trim()) return;
    setCourses([
      ...courses,
      { code: input.trim().toUpperCase(), name: "Học phần mới", date: "4/1/2022", status: "Thành công", credits: 2 }
    ]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Gửi đăng ký thành công!");
  };

  return (
    <div className="container" style={{ background: "#fff", borderRadius: 16, margin: "32px auto", padding: 32, boxShadow: "0 2px 12px #25324e0a" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Mã HP đăng ký"
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minWidth: 140 }}
          />
          <button type="button" onClick={handleAdd} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
            Đăng ký
          </button>
        </div>
        <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 8, fontSize: 17 }}>Bảng đăng ký học phần kỳ 20221 của sinh viên 20202849</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginBottom: 8 }}>
            <thead>
              <tr style={{ background: "#f1f1f7" }}>
                <th style={thStyle}>Mã HP</th>
                <th style={thStyle}>Tên lớp</th>
                <th style={thStyle}>Ngày đăng ký</th>
                <th style={thStyle}>TT đăng ký</th>
                <th style={thStyle}>Số TC</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{row.code}</td>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{row.date}</td>
                  <td style={tdStyle}>{row.status}</td>
                  <td style={tdStyle}>{row.credits}</td>
                  <td style={tdStyle}>
                    <input type="checkbox" checked={selected.includes(idx)} onChange={() => handleCheck(idx)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: "right", marginBottom: 12, fontWeight: 500 }}>
          Tổng số TC đăng ký = {totalCredits}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button
            type="submit"
            style={{
              padding: "10px 32px",
              borderRadius: 8,
              background: "#c12e40",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
              cursor: "pointer"
            }}
          >
            Gửi đăng ký
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              background: "#eee",
              color: "#c12e40",
              fontWeight: 600,
              fontSize: 16,
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            Xóa các HP chọn
          </button>
        </div>
      </form>
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