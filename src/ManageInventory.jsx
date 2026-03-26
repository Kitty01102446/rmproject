import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  FiEdit2,
  FiDownload,
  FiPlusCircle,
  FiAlertTriangle,
  FiSave,
  FiX,
} from "react-icons/fi";
import "./ManageInventory.css";

export default function ManageInventory() {
  const [items, setItems] = useState([
    { id: 1, name: "เจลเคลือบเงา", category: "เจลและสี", qty: 15, status: "ปกติ" },
    { id: 2, name: "หลอดแสง UV", category: "อุปกรณ์", qty: 5, status: "ปกติ" },
    { id: 3, name: "ตะไบเล็บ", category: "อุปกรณ์", qty: 2, status: "ต้องสั่งซื้อ" },
    { id: 4, name: "สีทาเล็บเจล - สีแดง", category: "เจลและสี", qty: 0, status: "หมดสต็อก" },
    { id: 5, name: "แปรงทาสี", category: "อุปกรณ์", qty: 8, status: "ปกติ" },
    { id: 6, name: "น้ำยาทำความสะอาด", category: "เคมีภัณฑ์", qty: 3, status: "ปกติ" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "", qty: "", status: "ปกติ" });

  const lowStock = items.filter((i) => i.qty > 0 && i.qty <= 2);
  const outStock = items.filter((i) => i.qty === 0);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "", qty: "", status: "ปกติ" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || formData.qty === "") {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...formData, id: i.id } : i))
      );
    } else {
      setItems((prev) => [...prev, { ...formData, id: Date.now(), qty: Number(formData.qty) }]);
    }

    setShowModal(false);
  };

  return (
    <div className="inventory-page admin-root">
      <main className="inventory">
        <div className="header">
          <div>
            <h1>คลังอุปกรณ์ร้าน</h1>
            <p>จัดการอุปกรณ์และสินค้าคงเหลือในร้าน</p>
          </div>
          <div className="actions">
            <button className="btn-export">
              <FiDownload /> ส่งออก CSV
            </button>
            <button className="btn-add" onClick={handleAdd}>
              <FiPlusCircle /> เพิ่มอุปกรณ์
            </button>
          </div>
        </div>

        {(lowStock.length > 0 || outStock.length > 0) && (
          <div className="alert-box">
            <div className="alert-icon">
              <FiAlertTriangle />
            </div>
            <div>
              <h4>แจ้งเตือนสต็อกต่ำกว่าเกณฑ์</h4>
              {lowStock.map((i) => (
                <p key={i.id}>
                  {i.name} - เหลือ <strong>{i.qty}</strong> ชิ้น
                </p>
              ))}
              {outStock.map((i) => (
                <p key={i.id}>
                  {i.name} - <span className="out">หมดสต็อก</span>
                </p>
              ))}
            </div>
            <button className="btn-small">เพิ่มสต็อก</button>
          </div>
        )}

        <div className="table-wrapper">
          <h3>รายการอุปกรณ์ทั้งหมด</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ชื่ออุปกรณ์</th>
                <th>หมวดหมู่</th>
                <th>จำนวน</th>
                <th>สภาพ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    {i.name}{" "}
                    {i.qty <= 2 && i.qty > 0 && <span className="warn-icon">⚠️</span>}
                  </td>
                  <td>{i.category}</td>
                  <td className={i.qty === 0 ? "danger" : ""}>{i.qty}</td>
                  <td>
                    <span
                      className={
                        i.status === "หมดสต็อก"
                          ? "badge danger"
                          : i.status === "ต้องสั่งซื้อ"
                          ? "badge warn"
                          : "badge normal"
                      }
                    >
                      {i.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(i)}>
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal &&
          ReactDOM.createPortal(
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingItem ? "แก้ไขอุปกรณ์" : "เพิ่มอุปกรณ์ใหม่"}</h3>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">
                  <label>ชื่ออุปกรณ์</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />

                  <label>หมวดหมู่</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="อุปกรณ์">อุปกรณ์</option>
                    <option value="เจลและสี">เจลและสี</option>
                    <option value="เคมีภัณฑ์">เคมีภัณฑ์</option>
                  </select>

                  <label>จำนวน</label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  />

                  <label>สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ปกติ">ปกติ</option>
                    <option value="ต้องสั่งซื้อ">ต้องสั่งซื้อ</option>
                    <option value="หมดสต็อก">หมดสต็อก</option>
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