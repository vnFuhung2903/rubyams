import React from "react";

const services = [
  {
    img: "https://ext.same-assets.com/3727013250/3687265187.jpeg",
    name: "Giảng Dạy",
    desc: "Thời khoá biểu, phân công giảng dạy, điểm danh"
  },
  {
    img: "https://ext.same-assets.com/3727013250/49761191.png",
    name: "Hướng Dẫn",
    desc: "Phân công, danh sách ĐA/ĐATN, Luận văn, Luận án"
  },
  {
    img: "https://ext.same-assets.com/3727013250/2546148331.png",
    name: "Phân Công, Danh Sách ĐA/ĐATN, ...",
    desc: "Bài báo, đề tài, sách, sáng chế, lý lịch khoa học"
  },
  {
    img: "https://ext.same-assets.com/3727013250/422080420.png",
    name: "Tổ Chức Cán Bộ",
    desc: "Bài báo, đề tài, sách, sáng chế, lý lịch khoa học"
  },
  {
    img: "https://ext.same-assets.com/3727013250/474873698.png",
    name: "Cơ Sở Vật Chất",
    desc: "Danh mục mặt bằng, thiết bị, trạng thái"
  },
  {
    img: "https://ext.same-assets.com/3727013250/38212318.png",
    name: "Hợp Tác Đối Ngoại",
    desc: "Đối tác, dự án, khoá đào tạo, trao đổi CB/SV, thực tập"
  },
  {
    img: "https://ext.same-assets.com/3727013250/310881352.png",
    name: "Học Viên",
    desc: "Tra cứu thông tin học viên"
  },
  {
    img: "https://ext.same-assets.com/3727013250/4071096847.png",
    name: "DASHBOARD",
    desc: "Bảng chỉ số thống kê, tổng hợp số liệu về các lĩnh vực"
  },
  {
    img: "https://ext.same-assets.com/3727013250/1865256596.png",
    name: "Văn Bản Pháp Luật",
    desc: "Danh mục Văn bản pháp luật"
  }
];

export default function TeacherServices() {
  return (
    <section className="container" style={{ paddingTop: 12 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#25324e', fontSize: 26 }}>Dịch Vụ Cho Giảng Viên</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {services.map((item, idx) => (
          <div
            key={item.name+idx}
            style={{
              width: '260px',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 4px 12px #25324e0a',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 24
            }}>
            <img src={item.img} alt={item.name} style={{ width: '100%', height: 116, objectFit: 'cover', background: '#f8f8fb' }} />
            <div style={{ padding: 16, flexGrow: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 17, color: '#25324e', marginBottom: 8 }}>{item.name}</div>
              <div style={{ fontSize: 14, color: '#555', marginBottom: 14 }}>{item.desc}</div>
              <button style={{ fontSize: 14, padding: '7px 18px', borderRadius: 7, border: 'none', background: '#f1f1f7', cursor: 'pointer', color: '#25324e', fontWeight: 600 }}>Chi tiết &nbsp;&gt;</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
