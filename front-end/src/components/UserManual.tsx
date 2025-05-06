import React from "react";

const steps = [
  {
    title: "Nhận tài khoản",
    desc: "Mỗi sinh viên được cấp một tài khoản với tài khoản và mật khẩu mặc định là mã số sinh viên."
  },
  {
    title: "Gửi yêu cầu",
    desc: "Sinh viên đăng nhập, điền biểu mẫu yêu cầu và nộp trên hệ thống online."
  },
  {
    title: "Xử lý yêu cầu",
    desc: "Cơ quan, đơn vị nhận yêu cầu online, xử lý và thông báo qua email khi hoàn thành."
  },
  {
    title: "Nhận kết quả",
    desc: "Khi nhận được thông báo yêu cầu xử lý thành công, Sinh viên lên văn phòng cơ quan, đơn vị thực hiện xử lý để nhận kết quả."
  },
];

const images = [
  "https://ext.same-assets.com/3727013250/3585654942.png",
  "https://ext.same-assets.com/3727013250/801309610.png",
  "https://ext.same-assets.com/3727013250/1865256596.png"
];

export default function UserManual() {
  return (
    <section className="container" style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', background: '#fff', borderRadius: 18, padding: 32, boxShadow: '0 4px 18px #25324e0c' }}>
        <div style={{ flex: '1 1 320px', minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#183153', marginBottom: 6 }}>Hướng dẫn sử dụng</div>
          <h2 style={{ fontSize: 26, color: '#25324e', marginBottom: 24 }}>DỊCH VỤ TRỰC TUYẾN</h2>
          <ol style={{ paddingLeft: 20 }}>
            {steps.map((s, i) => (
              <li key={i} style={{ marginBottom: 19, color: '#c12e40', fontWeight: 700, fontSize: 15 }}>
                Bước {i+1}: <span style={{ color: '#25324e', fontWeight: 600 }}>{s.title}</span>
                <div style={{ fontWeight: 400, color: '#555', fontSize: 14, marginTop: 6 }}>{s.desc}</div>
              </li>
            ))}
          </ol>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '0 1 230px', minWidth: 120, alignItems: 'center' }}>
          {images.map((img, idx) => (
            <img key={img+idx} src={img} alt="user manual step" style={{ width: 200, maxWidth: '100%', borderRadius: 10, background: '#f8fafd', objectFit: 'cover' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
