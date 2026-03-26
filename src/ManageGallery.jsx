import React, { useState } from "react";
import { FiSearch, FiHeart, FiSend, FiCheckCircle, FiUpload, FiX } from "react-icons/fi";
import "./ManageGallery.css";

export default function ManageGallery() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    tag: "",
    artist: "",
    date: "",
    image: "",
  });

  const [photos, setPhotos] = useState([
    {
      id: 1,
      title: "เพ้นท์เล็บลายแฟชั่น",
      image: "/gallery/nail1.jpg",
      likes: 45,
      artist: "วิภา ศิริมิช่วย",
      date: "25/10/2568",
      tag: "เพ้นท์เล็บ",
      status: "ผ่านการตรวจสอบ",
    },
    {
      id: 2,
      title: "ต่อเล็บอะคริลิค",
      image: "/gallery/nail2.jpg",
      likes: 32,
      artist: "สุชา เส้นสวย",
      date: "24/10/2568",
      tag: "ต่อเล็บ",
      status: "ผ่านการตรวจสอบ",
    },
    {
      id: 3,
      title: "เพ้นท์ลายสวย",
      image: "/gallery/nail3.jpg",
      likes: 28,
      artist: "มาลี เพิ่มศรี",
      date: "23/10/2568",
      tag: "เพ้นท์",
      status: "ผ่านการตรวจสอบ",
    },
    {
      id: 4,
      title: "สปามือ",
      image: "/gallery/nail4.jpg",
      likes: 52,
      artist: "นิภา ดีไซน์",
      date: "22/10/2568",
      tag: "สปา",
      status: "รอตรวจสอบ",
      pending: true,
    },
  ]);

  const handleSendToAdmin = (id) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, pending: false, status: "ส่งให้แอดมินแล้ว" } : p
      )
    );
    setToast("✅ ส่งให้แอดมินตรวจสอบแล้ว");
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddPhoto = () => {
    if (!newPhoto.title || !newPhoto.image || !newPhoto.artist) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const newItem = {
      id: Date.now(),
      ...newPhoto,
      likes: 0,
      status: "รอตรวจสอบ",
      pending: true,
    };

    setPhotos([newItem, ...photos]);
    setShowModal(false);
    setNewPhoto({ title: "", tag: "", artist: "", date: "", image: "" });
    setToast("📸 เพิ่มรูปผลงานใหม่เรียบร้อยแล้ว!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewPhoto({ ...newPhoto, image: reader.result });
    reader.readAsDataURL(file);
  };

  const filtered = photos.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gallery-page admin-root">
      <main className="manage">
        <div className="header">
          <div>
            <h1>แกลเลอรีร้าน</h1>
            <p>จัดการรูปภาพผลงานในสตูดิโอของร้าน</p>
          </div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            + เพิ่มรูปผลงาน
          </button>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <FiSearch className="icon" />
            <input
              type="text"
              placeholder="ค้นหาผลงาน..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select>
            <option>ช่างทั้งหมด</option>
            <option>วิภา ศิริมิช่วย</option>
            <option>สุชา เส้นสวย</option>
            <option>มาลี เพิ่มศรี</option>
          </select>
          <select>
            <option>ทุกหมวดหมู่</option>
            <option>ต่อเล็บ</option>
            <option>เพ้นท์เล็บ</option>
            <option>สปา</option>
          </select>
        </div>

        <div className="gallery-grid">
          {filtered.map((p) => (
            <div key={p.id} className="gallery-card">
              <div className="img-box">
                {p.pending && <span className="badge">รอตรวจสอบ</span>}
                <img src={p.image} alt={p.title} />
              </div>

              <div className="info">
                <div className="top">
                  <span className="tag">{p.tag}</span>
                  <span className="like">
                    <FiHeart /> {p.likes}
                  </span>
                </div>

                <h4>{p.title}</h4>
                <p className="artist">ช่าง: {p.artist}</p>
                <p className="date">{p.date}</p>

                {p.pending ? (
                  <button
                    className="btn-send"
                    onClick={() => handleSendToAdmin(p.id)}
                  >
                    <FiSend /> ส่งให้แอดมินตรวจสอบ
                  </button>
                ) : (
                  <button className="btn-sent" disabled>
                    <FiCheckCircle /> ส่งให้แอดมินแล้ว
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>เพิ่มรูปผลงานใหม่</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <label>ชื่อผลงาน</label>
              <input
                type="text"
                value={newPhoto.title}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, title: e.target.value })
                }
              />

              <label>หมวดหมู่</label>
              <select
                value={newPhoto.tag}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, tag: e.target.value })
                }
              >
                <option value="">เลือกหมวดหมู่</option>
                <option value="ต่อเล็บ">ต่อเล็บ</option>
                <option value="เพ้นท์เล็บ">เพ้นท์เล็บ</option>
                <option value="สปา">สปา</option>
              </select>

              <label>ช่าง</label>
              <input
                type="text"
                value={newPhoto.artist}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, artist: e.target.value })
                }
              />

              <label>วันที่</label>
              <input
                type="text"
                placeholder="เช่น 28/10/2568"
                value={newPhoto.date}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, date: e.target.value })
                }
              />

              <label>อัปโหลดรูปภาพ</label>
              <div className="upload-box">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <FiUpload /> เลือกรูปจากเครื่อง
              </div>

              {newPhoto.image && (
                <img src={newPhoto.image} alt="preview" className="preview" />
              )}
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                ยกเลิก
              </button>
              <button className="save-btn" onClick={handleAddPhoto}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
