import "./Footer.css";
import { Link } from "react-router-dom"; // เพิ่ม Link
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "../i18n.jsx";
const logo = "/Logo/logoweb.png";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">

          {/* ส่วนซ้าย: Stay Up To Date (เหมือนเดิม) */}
          <div className="footer-col footer-newsletter">
            <h3>{t("footer_stay_updated")}</h3>
            <p>{t("footer_newsletter_text")}</p>
            <div className="email-input-group">
              <input type="email" placeholder={t("footer_email")} />
              <button className="btn-subscribe">{t("footer_subscribe")}</button>
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
              {t("footer_tagline_line1")} <br />
              {t("footer_tagline_line2")}
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
              <h3>{t("footer_navigate")}</h3>
              <div className="nav-line"></div>
            </div>
            <div className="nav-links-grid">
              <div className="nav-item"><a href="#">{t("footer_home")}</a></div>
              <Link to="/helpCenter">{t("footer_contact")}</Link>
              <div className="nav-item"><a href="#">{t("footer_services")}</a></div>
              <Link to="/aboutGlamNail">{t("footer_about")}</Link>
              <div className="nav-item"><a href="#">{t("footer_faq")}</a></div>
              <div className="nav-item"><a href="#">{t("footer_privacy")}</a></div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© COPYRIGHT {new Date().getFullYear()} | ALL RIGHTS RESERVED | NAILS BY CRYSTAL SHINE</p>
        </div>
      </div>

      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {t("footer_top")} <span>↑</span>
      </button>
    </footer>
  );
}
