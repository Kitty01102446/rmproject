import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FiEdit2, FiShare2, FiPlusCircle, FiX, FiSave } from "react-icons/fi";
import "./ManagePromotions.css";

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: "ส่วนลดรับฝน 20%",
      desc: "ส่วนลด 20% สำหรับลูกค้าที่จองคิวทำเล็บในสัปดาห์นี้",
      date: "1 ต.ค. ถึง 31 ต.ค.",
      discount: "20%",
      bookings: 45,
      status: "กำลังใช้งาน",
    },
    {
      id: 2,
      name: "Happy Friday",
      desc: "ลดราคาพิเศษวันศุกร์ทุกสัปดาห์",
      date: "1 ต.ค. ถึง 31 ต.ค.",
      discount: "15%",
      bookings: 32,
      status: "กำลังใช้งาน",
    },
    {
      id: 3,
      name: "แพ็กพิเศษต่อเล็บ + เพ้นท์",
      desc: "แพ็กเกจ ต่อเล็บ + เพ้นท์ ลดเพิ่ม 25%",
      date: "1 พ.ย. ถึง 30 พ.ย.",
      discount: "25%",
      bookings: 0,
      status: "เตรียมใช้",
    },
    {
      id: 4,
      name: "ลูกค้าใหม่ลด 10%",
      desc: "ส่วนลดพิเศษสำหรับลูกค้าใหม่",
      date: "1 ก.ย. ถึง 30 ก.ย.",
      discount: "10%",
      bookings: 28,
      status: "หมดอายุ",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    date: "",
    discount: "",
    bookings: 0,
    status: "กำลังใช้งาน",
  });

  const handleAdd = () => {
    setEditingPromo(null);
    setFormData({
      name: "",
      desc: "",
      date: "",
      discount: "",
      bookings: 0,
      status: "กำลังใช้งาน",
    });
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData(promo);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.desc || !formData.date || !formData.discount) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (editingPromo) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === editingPromo.id ? { ...formData, id: p.id } : p))
      );
    } else {
      setPromotions((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="promotion-page admin-root">
      <main className="promotion">
        <div className="header">
          <div>
            <h1>โปรโมชั่นและแพ็กเกจ</h1>
            <p>จัดการโปรโมชั่นและส่วนลดพิเศษ</p>
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <FiPlusCircle /> เพิ่มโปรโมชั่นใหม่
          </button>
        </div>

        <div className="table-wrapper">
          <h3>รายการโปรโมชั่นทั้งหมด</h3>
          <table className="promotion-table">
            <thead>
              <tr>
                <th>ชื่อโปร</th>
                <th>วันที่เริ่ม - สิ้นสุด</th>
                <th>ส่วนลด</th>
                <th>ยอดจอง</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="desc">{p.desc}</div>
                  </td>
                  <td>{p.date}</td>
                  <td>
                    <span className="discount-badge">{p.discount}</span>
                  </td>
                  <td>📊 {p.bookings}</td>
                  <td>
                    <span
                      className={
                        p.status === "กำลังใช้งาน"
                          ? "badge active"
                          : p.status === "เตรียมใช้"
                          ? "badge upcoming"
                          : "badge expired"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon">
                      <FiShare2 />
                    </button>
                    <button className="btn-icon" onClick={() => handleEdit(p)}>
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal &&
          ReactDOM.createPortal(
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingPromo ? "แก้ไขโปรโมชั่น" : "เพิ่มโปรโมชั่นใหม่"}</h3>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">
                  <label>ชื่อโปรโมชั่น</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />

                  <label>รายละเอียด</label>
                  <textarea
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  />

                  <label>วันที่เริ่มต้น - สิ้นสุด</label>
                  <input
                    type="text"
                    placeholder="เช่น 1 พ.ย. ถึง 30 พ.ย."
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />

                  <label>ส่วนลด (%)</label>
                  <input
                    type="text"
                    placeholder="เช่น 20%"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />

                  <label>สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="กำลังใช้งาน">กำลังใช้งาน</option>
                    <option value="เตรียมใช้">เตรียมใช้</option>
                    <option value="หมดอายุ">หมดอายุ</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>
                    ยกเลิก
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    <FiSave /> บันทึก
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </main>
    </div>
  );
}
