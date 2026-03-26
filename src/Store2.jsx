import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStore_address } from "./callapi/call_api_store2.jsx";
import { getStoreById } from "./callapi/call_api_store2.jsx"; // 2. เปลี่ยนฟังก์ชันที่ใช้ดึง
import "./Store2.css";

export default function StorePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selected, setSelected] = useState(new Set());
  const [store2, setStore2] = useState(null);
  const [servicesFromApi, setServicesFromApi] = useState([]);

  // รูปภาพสำรองกรณีรูปจาก API ไม่ขึ้น
  const SAMPLE_IMAGES = [
    "https://i.pinimg.com/1200x/1f/91/7c/1f917cf916b15f21a3979ea0f46d1e17.jpg",
    "https://i.pinimg.com/736x/43/68/69/436869a369e7067e16181aa608520a71.jpg",
    "https://i.pinimg.com/1200x/f9/76/a5/f976a5c725b25acc3277273569334223.jpg"
  ];

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.465133618683!2d100.5369678759005!3d13.750961797316744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ec60a920215%3A0x62c9339e1e93f3d5!2sCentral%20World!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth";

  // ใน Store2.jsx
  useEffect(() => {
    async function fetchStoreData() {
      try {
        // 1. ดึงข้อมูล
        const servicesResponse = await getStoreById(id);
        const addressResponse = await getStore_address(id);

        // 🚩 Debug: ดูว่า servicesResponse หน้าตาเป็นยังไง
        console.log("Services Raw:", servicesResponse);
        console.log("Address Raw:", addressResponse);

        // 2. จัดการข้อมูล Address (จากภาพที่ 4 addressResponse เป็น Object อยู่แล้ว)
        const addressInfo = addressResponse || {};

        // 3. จัดการข้อมูล Services (ต้องเป็น Array)
        const serviceList = Array.isArray(servicesResponse) ? servicesResponse : [];

        if (serviceList.length > 0 || addressInfo.store_id) {
          // ✅ ผสานข้อมูล: เอาตัวแรกของ serviceList มาทำเป็นข้อมูลร้านเบื้องต้น + ที่อยู่
          const baseStoreInfo = serviceList.length > 0 ? serviceList[0] : {};
          setStore2({ ...baseStoreInfo, ...addressInfo });

          // ✅ สร้างเมนูบริการ
          const serviceMap = new Map();
          serviceList.forEach((r) => {
            if (r.service_id && !serviceMap.has(r.service_id)) {
              serviceMap.set(r.service_id, {
                id: r.service_id,
                name: r.service_name,
                price: Number(r.price), // มั่นใจว่าเป็นตัวเลข
                minutes: r.duration_minutes
              });
            }
          });
          setServicesFromApi(Array.from(serviceMap.values()));
        }
      } catch (err) {
        console.error("Error loading store data:", err);
      }
    }
    if (id) { fetchStoreData(); }
  }, [id]);

  const handleGoToBooking = () => {
    const selectedServices = servicesFromApi.filter(s => selected.has(s.id));

    const bookingData = {
      storeId: id, // ID จาก useParams() ของหน้า Store2
      storeName: store2?.store_name || "Nail Bar",
      services: selectedServices // เฉพาะรายการที่ผู้ใช้เลือกจริง
    };

    // บันทึกทับของเดิมทุกครั้งก่อนย้ายหน้า
    sessionStorage.setItem("bookingPayload", JSON.stringify(bookingData));
    navigate("/booking");
  };

  const selectedList = servicesFromApi.filter(s => selected.has(s.id));
  const totalPrice = selectedList.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="st-clean-root">
      <div className="st-wrapper">
        <header className="st-hero">
          <h1 className="st-main-name">
            {store2?.store_name || "NAILBAR CENTRAL PLAZA"}
            {store2?.is_verified === 1 && <span className="st-v-badge">Verified</span>}
          </h1>
          <p style={{ fontStyle: 'italic', color: '#888', marginTop: '15px' }}>“ {store2?.recommend_text} ”</p>
        </header>

        {/* Image Gallery */}
        <div className="st-image-grid">
          <img src={SAMPLE_IMAGES[0]} className="st-img-main" alt="Interior" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <img src={SAMPLE_IMAGES[1]} className="st-img-sub" alt="Detail 1" />
            <img src={SAMPLE_IMAGES[2]} className="st-img-sub" alt="Detail 2" />
          </div>
        </div>

        <div className="st-content-grid">
          <div className="st-left-col">
            <h2 className="st-section-title">Menu of Services</h2>
            <div className="st-service-table">
              <div className="st-table-header">
                <span>TREATMENT</span>
                <span>DURATION</span>
                <span style={{ textAlign: 'right' }}>PRICE</span>
              </div>
              {servicesFromApi.map(s => (
                <div key={s.id}
                  className={`st-table-row ${selected.has(s.id) ? 'selected' : ''}`}
                  onClick={() => {
                    const n = new Set(selected);
                    n.has(s.id) ? n.delete(s.id) : n.add(s.id);
                    setSelected(n);
                  }}>
                  <span style={{ fontFamily: 'Tenor Sans', fontSize: '18px' }}>{s.name}</span>
                  <span style={{ color: '#999' }}>{s.minutes} MINS</span>
                  <span style={{ textAlign: 'right', fontWeight: '500' }}>฿{s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <h2 className="st-section-title">Location & Map</h2>
            <p>{store2?.street} {store2?.district}, {store2?.province}</p>
            <div className="st-map-box">
              <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
            </div>
          </div>

          <div className="st-right-col">
            <div className="st-booking-card">
              <h3 style={{ fontFamily: 'Tenor Sans', fontSize: '24px', marginBottom: '20px' }}>Selection Summary</h3>
              <div style={{ minHeight: '60px' }}>
                {selectedList.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                    <span>{s.name}</span>
                    <span>฿{s.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: '20px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '2px', color: '#B09987' }}>TOTAL</label>
                <div style={{ fontSize: '36px', fontFamily: 'Tenor Sans' }}>฿{totalPrice.toLocaleString()}</div>
              </div>
              <button className="st-btn-book" disabled={selected.size === 0} onClick={handleGoToBooking}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}