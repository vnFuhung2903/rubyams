import React from "react";

const studentServices = [
  {
    icon: "https://ext.same-assets.com/3727013250/49761191.png",
    title: "Thu Báo Tin Nhắn",
    desc: "Thông báo mới nhất cho sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/2020427920.ttf",
    title: "Học Phí Công Nợ",
    desc: "Thông tin về học phí của sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/1545603491.png",
    title: "Hướng Nghiệp",
    desc: "Bài đăng về cơ hội việc làm và thực tập dành cho sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/3585654942.png",
    title: "Hồ Sơ Sinh Viên",
    desc: "Thông tin cá nhân, địa chỉ liên lạc của sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/801309610.png",
    title: "Đồ Án Tốt Nghiệp",
    desc: "Thông tin chương trình đào tạo của sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/3215085996.png",
    title: "Học Bổng",
    desc: "Thông tin các loại học bổng, các đăng ký xét học bổng",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/311005913.png",
    title: "Thời Khoá Biểu",
    desc: "Thông tin về thời khoá biểu của sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/2322512730.png",
    title: "Chương Trình Đào Tạo",
    desc: "Thông tin về các chương trình đào tạo của sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/3582593683.png",
    title: "Thủ Tục Hành Chính",
    desc: "Cấp các loại giấy tờ",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/3687265187.jpeg",
    title: "Kết Quả Học Tập",
    desc: "Cấp các loại giấy tờ",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/38212318.png",
    title: "Hoạt Động Ngoại Khóa",
    desc: "Chương trình do Đoàn Thanh niên, Hội sinh viên tổ chức",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/4071096847.png",
    title: "Đăng Ký Dịch Vụ",
    desc: "Dịch vụ của phòng Cơ sở vật chất làm vé xe",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/4149630597.png",
    title: "Đăng Ký Học Tập",
    desc: "Đăng ký các môn học tiếng anh đầu vào",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/2546148331.png",
    title: "Đánh Giá Rèn Luyện",
    desc: "Minh chứng các hoạt động để đánh giá và theo dõi điểm rèn luyện",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/4217777445.png",
    title: "Thư Viện Số",
    desc: "Dịch vụ tài liệu điện tử",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/49761191.png",
    title: "Trợ Giúp",
    desc: "Tiếp nhận và trả lời hỏi đáp cho sinh viên",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/3215085996.png",
    title: "Ký Túc Xá",
    desc: "Đăng ký KTX Bách Khoa và Pháp Vân",
  },
  {
    icon: "https://ext.same-assets.com/3727013250/311005913.png",
    title: "Văn Bản Pháp Luật",
    desc: "Danh mục Văn bản pháp luật",
  },
];

export default function StudentServices() {
  return (
    <section className="container" style={{ paddingBottom: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 32, color: '#25324e', fontSize: 26 }}>Dịch Vụ Cho Sinh Viên</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        maxWidth: 900,
        margin: '0 auto',
      }}>
        {studentServices.map((serv, idx) => (
          <div
            key={serv.title+idx}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 18,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              boxShadow: '0 2px 8px #25324e07',
            }}
          >
            <img src={serv.icon} alt={serv.title} style={{ width: 38, height: 38, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#25324e', marginBottom: 6 }}>{serv.title}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{serv.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
