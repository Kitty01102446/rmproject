import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStores } from "./callapi/call_api_user.jsx";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AOS from "aos"; // 1. Import AOS
import "aos/dist/aos.css"; // 2. Import CSS
import "./AllStores.css";

const PER_PAGE = 8;

export default function AllStores() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("best");
  const [page, setPage] = useState(1);
  const [store, setStore] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // ดึงข้อมูลจาก localStorage มาตั้งต้น (ถ้ามี)
    const saved = localStorage.getItem("my_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // บันทึกลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("my_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // 3. Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await getStores();
        setStore(res.data || []);
      } catch (err) { console.error("Error loading data:", err); }
    }
    fetchStore();
  }, []);

  useEffect(() => {
    const qParam = params.get("q") || "";
    setQ(qParam);
  }, [params]);

  const filtered = useMemo(() => {
    return store.filter((s) => {
      if (q && !s.store_name?.toLowerCase().includes(q.toLowerCase())) return false;
      if (area && s.area !== area) return false;
      return true;
    });
  }, [store, q, area]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "rating") arr.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    else if (sort === "price_asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [filtered, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const items = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => setPage(1), [q, area, sort]);

  return (
    <div className="ag-root">
      {/* Hero Section - ใส่ AOS แบบแยกทิศทางภาพ */}
      <section className="ag-hero-modern">
        <div className="hero-visual-layers">
          <div className="img-box box-1" data-aos="fade-down-right" data-aos-delay="200">
            <img src="https://i.pinimg.com/1200x/a9/b4/85/a9b4851e32d7ab8d81cb501a632fa380.jpg" alt="v1" />
          </div>
          <div className="img-box box-2" data-aos="fade-down-left" data-aos-delay="400">
            <img src="https://i.pinimg.com/1200x/a4/8d/89/a48d8916bd3a8a2723390d870269d7fc.jpg" alt="v2" />
          </div>
          <div className="img-box box-3" data-aos="fade-up-right" data-aos-delay="600">
            <img src="https://i.pinimg.com/1200x/fe/f1/aa/fef1aa363432f16e73183e057604dfcf.jpg" alt="v3" />
          </div>
          <div className="img-box box-4" data-aos="fade-up-left" data-aos-delay="800">
            <img src="https://i.pinimg.com/1200x/3e/91/14/3e91145173d4d88e009214827ca4e0fa.jpg" alt="v4" />
          </div>
        </div>

        <div className="hero-center-content" data-aos="zoom-in" data-aos-duration="1500">
          <span className="hero-tagline">the atelier tagline</span>
          <h1 className="hero-title">ALL STORE <br />NAILS</h1>
          <p className="hero-desc">
            JOIN THE 7 DAY MIRACLE PROGRAM <br />
            RECOVERING TONE AND ELASTICITY OF YOUR NAILS.
          </p>
          <button className="ag-btn-sharp">VIEW ALL</button>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="ag-filter-bar" data-aos="fade-up">
        <div className="ag-container">
          <div className="ag-filter-group">
            <button className={area === "" ? "active" : ""} onClick={() => setArea("")}>All Store</button>
            {["สยาม", "อารีย์", "ขอนแก่น", "ลาดพร้าว"].map(a => (
              <button key={a} className={area === a ? "active" : ""} onClick={() => setArea(a)}>{a}</button>
            ))}
          </div>
          <div className="ag-search-wrapper">
            <input type="text" placeholder="Search studio..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="ag-container">
        <div className="ag-section-title" data-aos="fade-right">
          <h2>Our Store</h2>
          <Link to="#" className="view-all">View All Store</Link>
        </div>

        <div className="ag-grid">
          {items.map((s, index) => (
            <div
              key={s.store_id || index}
              className="ag-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="ag-card-img">
                <img src={`http://127.0.0.1:5010/static/images/${s.image}`} alt={s.store_name} />
              </div>

              <div className="ag-card-content">
                {/* ส่วนที่แก้ไข: จัดกลุ่มชื่อและปุ่มหัวใจ */}
                <div className="title-row">
                  <h3>{s.store_name}</h3>
                  <button
                    className={`fav-btn ${favorites.includes(s.store_id) ? "active" : ""}`}
                    onClick={() => toggleFavorite(s.store_id)}
                  >
                    {favorites.includes(s.store_id) ? (
                      <FaHeart className="heart-icon" />
                    ) : (
                      <FaRegHeart className="heart-icon" />
                    )}
                  </button>

                </div>

                <div className="price-row">
                  <span className="price">฿{Number(s.price).toLocaleString()}</span>
                </div>
                <Link to={`/store2/${s.store_id}`} className="ag-add-btn">
                  BOOKING
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="ag-pagination" data-aos="fade-up">
          {[...Array(pages)].map((_, i) => (
            <button key={i + 1} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </main>

      {/* Special Offer Section */}
      <section className="ag-offer-banner" data-aos="fade-in">
        <div className="ag-container offer-flex">
          <div className="offer-image" data-aos="zoom-out-right" data-aos-delay="200">
            <img src="https://i.pinimg.com/736x/4b/c1/5b/4bc15bdb3aabb81077b49fcc066efb41.jpg" alt="special offer" />
            <div className="offer-text-box">
              <h3>Special Offer</h3>
              <p>Nail Art Session</p>
              <button className="learn-more">Learn More</button>
            </div>
          </div>
          <div className="offer-content" data-aos="fade-left" data-aos-delay="400">
            <h2>Get Discount <strong>25% Off</strong></h2>
            <p>โปรโมชั่นพิเศษสำหรับการจองผ่านระบบออนไลน์วันนี้ รับส่วนลดทันทีสำหรับทุกบริการ</p>
            <div className="subscribe-box">
              <input type="email" placeholder="Email Address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}