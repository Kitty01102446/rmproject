import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getClick_log } from "./callapi/call_api_home.jsx"; // ส่วนดึงข้อมูลยอดนิยม
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";
import { useLanguage } from "./i18n.jsx";

const IMAGE_BASE_URL = "https://backend-gold-kappa-26.vercel.app/static/images";

export default function Home() {
  const { language, t } = useLanguage();
  // 1. State สำหรับค้นหา
  const [searchArea, setSearchArea] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("14:30");
  const [searchService, setSearchService] = useState("เจลมือ / เท้า");

  // 2. State สำหรับเก็บข้อมูลจาก Database (API)
  const [Click_log, setClick_log] = useState([]);

  // 3. ส่วนดึงข้อมูล (API Fetching) และ Initial AOS
  useEffect(() => {
    // ตั้งค่า AOS
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-out-quart'
    });

    // ฟังก์ชันดึงข้อมูล Popular Stores
    async function fetchClick_log() {
      try {
        const res = await getClick_log();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setClick_log(res.data); // เก็บข้อมูลร้านที่ถูกคลิกบ่อย/ยอดนิยม
        }
      } catch (err) {
        console.error("Error fetching click log:", err);
      }
    }
    fetchClick_log();
  }, []);

  const navigate = useNavigate();
  const goSearch = () => {
    const params = new URLSearchParams();
    if (searchArea) params.set("q", searchArea);
    if (searchService) params.set("service", searchService);
    if (searchDate) params.set("date", searchDate);
    if (searchTime) params.set("time", searchTime);
    navigate(`/AllStores?${params.toString()}`);
  };

  // 4. Favorites & Chips Logic
  const [favorites, setFavorites] = useState(new Set());
  const toggleFav = (id) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // 5. Data ร้านค้าแนะนำ (Local Favorites)
  const baseStores = useMemo(() => [
    {
      id: "s-1",
      title: "Pink Atelier Siam",
      desc: "BTS สยาม • เจลมือ/เท้า • เพ้นท์ลายมินิมอล",
      tag: "โทนชมพูมินิมอล",
      rating: 4.9,
      price: 890,
      distance: 0.9,
      img: "/Nailshop/Nailshop7.jpg",
      times: ["14:00", "15:30", "17:00"],
      badge: "Top Rated",
    },
    {
      id: "s-2",
      title: "Blush & Buff Ari",
      desc: "BTS อารีย์ • สปา • ต่อเล็บธรรมชาติ",
      tag: "สปามือ-เท้า",
      rating: 4.7,
      price: 690,
      distance: 3.2,
      img: "/Nailshop/Nailshop9.jpg",
      times: ["13:00", "16:00", "18:30"],
      badge: "Promo",
    },
    {
      id: "s-3",
      title: "Milk Pink Studio KK",
      desc: "ขอนแก่น • โทนชมพู-ขาว • เพ้นท์มินิมอล",
      tag: "เจลชมพูใส",
      rating: 4.8,
      price: 790,
      distance: 1.5,
      img: "/Nailshop/Nailshop8.jpg",
      times: ["11:30", "15:00", "19:00"],
      badge: "New",
    },
  ], []);

  const [sortMode, setSortMode] = useState("best");
  const stores = useMemo(() => {
    const arr = [...baseStores];
    const score = {
      rating: (s) => -s.rating,
      price: (s) => s.price,
      distance: (s) => s.distance,
      best: (s) => -s.rating + s.price / 1000,
    };
    return arr.sort((a, b) => score[sortMode](a) - score[sortMode](b));
  }, [baseStores, sortMode]);

  return (
    <main className="home">
      {/* HERO SECTION */}
      <section className="hero-container">
        <div className="container">
          <h1 className="beatrice-title" data-aos="fade-down">Crystal Shine</h1>
          <div className="hero-image-wrapper" data-aos="zoom-in" data-aos-duration="1500">
            <img src="/Nailshop/model.jpg" alt="Nail Art Design" />
          </div>
          <div className="hero-float-text" data-aos="fade-up" data-aos-delay="400">
            {t("home_hero_text")}
          </div>
          <Link to="/AllStores" className="shop-now-pill" data-aos="fade-up" data-aos-delay="600">
            {t("home_book_now")} &rarr;
          </Link>
        </div>
      </section>
      <div className="marquee-strip">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
            <span>AI SKIN TONE ANALYSIS ✹ HIGH-END NAIL STUDIOS ✹ PRECISE COLOR MATCHING ✹</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="container search-container-luxury" data-aos="fade-up" data-aos-offset="0">
        <div className="search-card-editorial">
          <div className="search-grid">
            <div className="search-field">
              <label>{t("home_location")}</label>
              <input type="text" placeholder="สยาม, อารีย์..." value={searchArea} onChange={(e) => setSearchArea(e.target.value)} />
            </div>
            <div className="search-field">
              <label>{t("home_date")}</label>
              <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            </div>
            <div className="search-field">
              <label>{t("home_service")}</label>
              <select value={searchService} onChange={(e) => setSearchService(e.target.value)}>
                <option>เจลมือ / เท้า</option>
                <option>เพ้นท์ลาย</option>
                <option>ต่อเล็บ</option>
                <option>สปามือ-เท้า</option>
              </select>
            </div>
            <button className="search-submit-btn" onClick={goSearch}>{t("home_find_slots")}</button>
          </div>
        </div>
      </div>

      {/* POPULAR STORES - ดึงข้อมูลจาก Click_log */}
      <section id="popular" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-header-editorial" data-aos="fade-right">
            <h2 className="playfair-title">{t("home_popular_title")}</h2>
            <p className="cormorant-subtitle">{t("home_popular_subtitle")}</p>
          </div>

          <div
            className="grid grid-4 home-popular-grid"
            style={{ marginTop: "50px" }}
          >
            {Click_log.slice(0, 4).map((p, index) => (
              <article className="st-card-luxury" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Link to="/AllStores" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="st-img-wrapper">
                    <img
                      src={p.image ? `${IMAGE_BASE_URL}/${p.image}` : "/Nailshop/placeholder.jpg"}
                      alt={p.store_name}
                      onError={(e) => {
                        e.currentTarget.src = "/Nailshop/placeholder.jpg";
                      }}
                    />
                    <span className="badge-luxury">HOT</span>
                  </div>
                  <div className="st-content">
                    <h3>{p.store_name}</h3>
                    <div className="st-meta-luxury">
                      <span>★ {Number(p.rating || 0).toFixed(1)}</span>
                      <span className="st-price-tag">เริ่ม ฿{p.price}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>



      {/* CATEGORIES - ทยอยโผล่ทีละอัน */}
      <section className="container" style={{ padding: "80px 0" }}>
        <div className="category-grid">
          {['STORES', 'AI COLOR', 'SHAPES'].map((item, idx) => (
            <div className="category-card" key={item} data-aos="fade-up" data-aos-delay={idx * 200}>
              <div className="img-frame">
                <img src={`/Nailshop/${idx === 0 ? 'store' : idx === 1 ? 'nailai' : 'nailshap'}.jpg`} alt={item} />
              </div>
              <h4>{item}</h4>
              <p>รายละเอียดคำอธิบายบริการ...</p>
              <Link to="/AllStores" style={{ textDecoration: "none", fontSize: "12px", fontWeight: "bold" }}>เพิ่มเติม &rarr;</Link>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVER - ลอยมาทางขวา */}
      <section id="discover" className="luxury-sec gray-bg">
        <div className="container">
          <div className="editorial-head" data-aos="fade-right">
            <div>
              <h2 className="playfair-title">{language === "th" ? "ร้านแนะนำประจำย่าน" : "Local Favorites"}</h2>
            </div>
            <Link className="editorial-link" to="/AllStores">{t("home_explore_more")} →</Link>
          </div>

          <div className="editorial-grid">
            {stores.map((s, idx) => (
              <article className="luxury-card full-detail" key={s.id} data-aos="fade-up" data-aos-delay={idx * 150}>
                {/* ... เนื้อหาการ์ด ... */}
                <div className="luxury-cover"><img src={s.img} alt={s.title} /></div>
                <div className="luxury-body">
                  <h3 className="playfair-name">{s.title}</h3>
                  <div className="luxury-cta">
                    <Link className="btn-outline-thin" to="/store2">DETAILS</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI SECTION - สไลด์สวนทางกัน */}
      <section className="ai-section-luxury">
        <div className="container ai-editorial-grid">
          <div className="ai-text-side" data-aos="fade-right">
            <span className="editorial-tag">{t("home_ai_tag")}</span>
            <h2 className="playfair-title" style={{ fontSize: "48px" }}>
              {language === "th" ? <>AI วิเคราะห์<br />ความงาม</> : <>AI-Driven <br />Beauty Analysis</>}
            </h2>
            {/* ... features ... */}
          </div>
          <div className="ai-visual-side" data-aos="fade-left">
            <div className="img-frame-editorial">
              <img src="/Nailshop/nailai.jpg" alt="AI Analysis" />
            </div>
          </div>
        </div>
      </section>

      {/* SHAPES - เรียงลำดับจากซ้ายไปขวา */}
      <section className="nail-shapes-editorial">
        <div className="container">
          <div className="shapes-grid-magazine">
            {["Oval", "Almond", "Square", "Coffin"].map((shape, i) => (
              <div className="shape-card-mag" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <div className="shape-img-box"><img src={`./nails/${shape.toLowerCase()}.png`} alt={shape} /></div>
                <h4>{shape}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - ขยายใหญ่ขึ้น */}
      <section className="cta-minimal" data-aos="zoom-out-up">
        <div className="container">
          <div className="cta-box-editorial">
            <h2 className="playfair-title">{t("home_join_title")}</h2>
            <Link to="/addStore" className="btn-luxury-outline">{t("home_partner_cta")}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
