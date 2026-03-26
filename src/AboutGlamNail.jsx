import React, { useEffect } from "react";
import "./AboutGlamNail.css";


export default function AboutGlamNail() {
  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function makeObserver(selector, toggleClass = "in") {
      const targets = document.querySelectorAll(selector);
      if (prefersReduce) {
        targets.forEach((el) => el.classList.add(toggleClass));
        return () => {};
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add(toggleClass);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      targets.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }

    const cleanups = [makeObserver(".reveal"), makeObserver(".stagger")];
    return () => cleanups.forEach((fn) => typeof fn === "function" && fn());
  }, []);

  return (
    <div className="gn-about">
      {/* --- HERO --- */}
      <section className="hero">
        <div className="container">
          <span className="label-mini reveal">GlamNail Perspective</span>
          <h1 className="reveal">The New Standard <br/> of Nail Booking</h1>
          <p className="lead reveal">
            GlamNail Studio คือแพลตฟอร์มที่ยกระดับประสบการณ์ความงาม 
            ผสานเทคโนโลยี <b>AI Skin Analysis</b> เพื่อการเลือกเฉดสีที่สมบูรณ์แบบ 
            และระบบการจองที่คัดสรรมาเพื่อไลฟ์สไตล์ที่ทันสมัย
          </p>

          <div className="chips reveal">
            <div className="chip"> Smart Booking</div>
            <div className="chip"> AI Color Palette</div>
            <div className="chip"> Artisan Curation</div>
            <div className="chip"> Exclusive Benefits</div>
            <div className="chip"> Beauty Community</div>
          </div>
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="section" style={{padding: '100px 0'}}>
        <div className="container">
          <div className="section-title-box reveal">
            <span className="label-mini">Our Journey</span>
            <h2 style={{fontFamily: 'Playfair Display', fontSize: '32px', textTransform:'uppercase' ,fontWeight:'300'}}>Evolution of Beauty</h2>
          </div>

          <div className="timeline">
            {/* 2025 */}
            <article className="tl reveal">
              <img src="./icon/ภาพถ่ายหน้าจอ 2569-01-18 เวลา 1.58.42 AM.png" alt="2025 Start" />
              <div>
                <span className="label-mini">Phase 01</span>
                <h3>2025 — The Genesis</h3>
                <small>Prototype • Core Booking • Partner Network</small>
                <p>
                  จุดเริ่มต้นจากการแก้ปัญหาความแออัดหน้าร้าน สู่การสร้างระบบ Dashboard 
                  แบบเรียลไทม์ที่ช่วยให้ช่างและลูกค้าสื่อสารกันได้อย่างไร้รอยต่อ
                </p>
              </div>
            </article>

            {/* 2026 */}
            <article className="tl reveal">
              <img src="./icon/ภาพถ่ายหน้าจอ 2569-01-18 เวลา 1.58.52 AM.png" alt="AI Analysis" />
              <div>
                <span className="label-mini">Phase 02</span>
                <h3>2026 — Intelligent Glow</h3>
                <small>AI Skin Tone • Review Gallery • Loyalty</small>
                <p>
                  เราเปิดตัว AI วิเคราะห์อันเดอร์โทนผิว เพื่อมอบคำแนะนำเฉดสีที่เป็นส่วนตัวที่สุด 
                  พร้อมระบบรีวิวที่เน้นภาพผลงานจริงเพื่อความมั่นใจในทุกการจอง
                </p>
              </div>
            </article>

            {/* 2027 */}
            <article className="tl reveal">
              <img src="./icon/ภาพถ่ายหน้าจอ 2569-01-18 เวลา 1.59.16 AM.png" alt="Community" />
              <div>
                <span className="label-mini">Phase 03</span>
                <h3>2027 — Cultivating Community</h3>
                <small>Trends • Workshops • Marketplace</small>
                <p>
                  สร้างพื้นที่แห่งแรงบันดาลใจผ่านคอมมูนิตี้เทรนด์เล็บระดับสากล 
                  และเวิร์กช็อปร่วมกับศิลปินช่างทำเล็บชั้นนำ
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* --- TEAM --- */}
      <section className="section" style={{padding: '100px 0', borderTop: '1px solid var(--border)'}}>
        <div className="container">
          <div className="section-title-box reveal">
            <span className="label-mini">Behind The Vision</span>
            <h2 style={{fontFamily: 'Playfair Display', fontSize: '32px', textTransform:'uppercase',fontWeight:'300'}}>Our Collective</h2>
          </div>
          
          <div className="team-grid">
            <div className="card reveal">
              <img src="./icon/kitty.JPG" alt="Developer 1" />
              <h4>Chakrit Uamom</h4>
              <p>System Architect • UX & Frontend</p>
            </div>
            <div className="card reveal">
              <img src="./icon/pang.png" alt="Developer 2" />
              <h4>Apisara Nakhonsuk</h4>
              <p>Backend Strategy • AI Module Lead</p>
            </div>
            <div className="card reveal">
              <img src="./icon/io.png" alt="Advisor" />
              <h4>Asst. Prof. Dr. Isun</h4>
              <p>Research Consultant • Academic Advisor</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '60px 0', fontSize: '10px', color: '#999', letterSpacing: '2px'}}>
        © 2026 GLAMNAIL STUDIO. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}