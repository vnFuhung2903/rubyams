import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: '#dedede', marginTop: 32, padding: '38px 0 0 0', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center', color: '#25324e' }}>
        <div style={{ marginBottom: 9, fontWeight: 600, letterSpacing: 0.1 }}>HỆ THỐNG DO ĐẠI HỌC BÁCH KHOA HÀ NỘI THIẾT KẾ & PHÁT TRIỂN.</div>
        <div style={{ marginBottom: 5 }}>Để hỗ trợ vui lòng gửi mail đến <b><a href="mailto:hung.nguyenthanh2@hust.edu.vn" style={{ color: '#c12e40', textDecoration: 'none' }}>hung.nguyenthanh2@hust.edu.vn</a></b></div>
        <div style={{ marginBottom: 5 }}>09.77.86.33.11</div>
        <div>Số 1 Đại Cồ Việt, Phường Bách Khoa, Quận Hai Bà Trưng, Thành phố Hà Nội</div>
        <div style={{ margin: '28px 0 0 0', fontWeight: 500, fontSize: 16 }}>Cài đặt ứng dụng eHUST trên điện thoại</div>
      </div>
      <div style={{ width: '100%', margin: '32px 0 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 90 }}>
        <img src="https://ext.same-assets.com/3727013250/1545603491.png" alt="Google Play Store" style={{ width: 200, height: 59, marginRight: 20 }} />
        <img src="https://ext.same-assets.com/3727013250/801309610.png" alt="Apple App Store" style={{ width: 200, height: 59, objectFit: 'contain' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 60, background: '#ccc', zIndex: 0, opacity: 0.45 }} />
    </footer>
  );
}
