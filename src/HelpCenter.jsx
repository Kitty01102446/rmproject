import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./HelpCenter.css";

export default function HelpCenter() {
  const [q, setQ] = useState("");

  // เริ่มต้นใช้งาน AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-expo", // จังหวะการเคลื่อนไหวแบบหรูหรา
    });
  }, []);

  return (
    <div className="hc-luxury">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');`}
      </style>

      {/* HERO SECTION */}
      <header className="hc-hero-v2">
        <div className="hc-hero-content">
          <span className="hc-label" data-aos="fade-down" data-aos-delay="200">CUSTOMER CARE</span>
          <h1 className="hc-main-title" data-aos="fade-up" data-aos-delay="400">
            HOW CAN WE <br />
            <em data-aos="italic-fade">Assist You</em> TODAY?
          </h1>
          <div className="hc-search-wrapper" data-aos="zoom-in" data-aos-delay="600">
            <input 
              type="text" 
              placeholder="Search for help... (e.g. Booking, Pricing)" 
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button>SEARCH</button>
          </div>
        </div>
      </header>

      {/* QUICK ACTIONS */}
      <section className="hc-container-v2">
        <div className="hc-services-grid">
          <div className="hc-service-card" data-aos="fade-up" data-aos-delay="200">
            <div className="hc-bg-text">01</div>
            <div className="hc-card-inner">
              <h3>TRACK BOOKING</h3>
              <p>ตรวจสอบสถานะนัดหมายล่าสุดของคุณได้ที่นี่</p>
              <a href="#/track" className="hc-link">CHECK NOW</a>
            </div>
          </div>

          <div className="hc-service-card" data-aos="fade-up" data-aos-delay="400">
            <div className="hc-bg-text">02</div>
            <div className="hc-card-inner">
              <h3>MANAGE APPOINTMENT</h3>
              <p>เปลี่ยนแปลงหรือยกเลิกการจองได้ด้วยตัวเอง</p>
              <a href="#/manage" className="hc-link">MANAGE</a>
            </div>
          </div>

          <div className="hc-service-card" data-aos="fade-up" data-aos-delay="600">
            <div className="hc-bg-text">03</div>
            <div className="hc-card-inner">
              <h3>FIND LOCATIONS</h3>
              <p>ดูแผนที่สาขา เวลาทำการ และที่จอดรถ</p>
              <a href="#/locations" className="hc-link">VIEW MAP</a>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS SECTION */}
      <section className="hc-topics-section">
        <div className="hc-container-v2">
           <div className="hc-flex-header">
              <h2 className="hc-side-title" data-aos="fade-right">TOPICS</h2>
              <div className="hc-topics-grid">
                  <a href="#" className="hc-topic-item" data-aos="fade-left" data-aos-delay="100">
                    <span>ACCOUNT</span>
                    <small>สมัครและจัดการข้อมูลส่วนตัว</small>
                  </a>
                  <a href="#" className="hc-topic-item" data-aos="fade-left" data-aos-delay="200">
                    <span>PAYMENT</span>
                    <small>โปรโมชั่นและช่องทางการชำระเงิน</small>
                  </a>
                  <a href="#" className="hc-topic-item" data-aos="fade-left" data-aos-delay="300">
                    <span>MEMBERSHIP</span>
                    <small>การสะสมแต้มและสิทธิพิเศษ</small>
                  </a>
                  <a href="#" className="hc-topic-item" data-aos="fade-left" data-aos-delay="400">
                    <span>POLICIES</span>
                    <small>กติกาและนโยบายความเป็นส่วนตัว</small>
                  </a>
              </div>
           </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="hc-contact-banner">
        <div className="hc-banner-box" data-aos="zoom-out-up">
           <p data-aos="fade-in" data-aos-delay="400">STILL NEED HELP?</p>
           <h2 data-aos="fade-up" data-aos-delay="600">GET IN TOUCH</h2>
           <div className="hc-contact-links" data-aos="fade-up" data-aos-delay="800">
              <a href="mailto:hello@glamnail.com">EMAIL US</a>
              <span className="hc-dot"></span>
              <a href="tel:0812345678">CALL SUPPORT</a>
              <span className="hc-dot"></span>
              <a href="#/chat">LIVE CHAT</a>
           </div>
        </div>
      </section>
    </div>
  );
}