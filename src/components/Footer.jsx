import "./Footer.css";
import { Link } from "react-router-dom"; // เพิ่ม Link
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
const logo = "/Logo/logoweb.png";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">

          {/* ส่วนซ้าย: Stay Up To Date (เหมือนเดิม) */}
          <div className="footer-col footer-newsletter">
            <h3>STAY UP TO DATE</h3>
            <p>This focuses on the idea of nail care not just as a beauty treatment, but as a confidence booster.</p>
            <div className="email-input-group">
              <input type="email" placeholder="EMAIL" />
              <button className="btn-subscribe">SUBSCRIBE</button>
            </div>
          </div>

          {/* --- ส่วนกลาง: เปลี่ยนจากตัว F เป็น Logo รูปภาพ --- */}
          <div className="footer-col footer-branding">
            <div className="logo-wrapper">
              <Link to="/" className="logo">
                {/* ลบ height={40} ออก เพื่อให้ CSS เป็นตัวคุมความสวยงาม */}
                <img src={logo} alt="NailShop" className="logo-img" />
              </Link>
            </div>
            <p className="tagline">
              Nail Your Style <br />
              Because You Deserve the Best
            </p>
            <div className="social-links">
              {/* ใส่ URL ใน href และใช้ Icon เป็นตัวแสดงผลข้างใน */}
              <a
                href="https://www.instagram.com/p4ngniiq?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>

              <a href="https://www.facebook.com/pxnghyun" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>

              <a href="https://twitter.com/youraccount" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>

              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* ส่วนขวา: Navigate (เหมือนเดิม) */}
          <div className="footer-col footer-nav">
            <div className="nav-header">
              <h3>NAVIGATE</h3>
              <div className="nav-line"></div>
            </div>
            <div className="nav-links-grid">
              <div className="nav-item"><a href="#">HOME</a></div>
              <Link to="/helpCenter">CONTACT</Link>
              <div className="nav-item"><a href="#">SERVICES</a></div>
              <Link to="/aboutGlamNail">ABOUT</Link>
              <div className="nav-item"><a href="#">FAQ</a></div>
              <div className="nav-item"><a href="#">PRIVACY POLICY</a></div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© COPYRIGHT {new Date().getFullYear()} | ALL RIGHTS RESERVED | NAILS BY CRYSTAL SHINE</p>
        </div>
      </div>

      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        TOP <span>↑</span>
      </button>
    </footer>
  );
}