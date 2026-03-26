import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import ReactDOM from "react-dom";
import "./ManageServices.css";
import {
  fetchServicesByStore,
  createService,
  updateServiceAPI,
  deleteServiceAPI,
} from "./callapi/call_api_manageservices"



export default function ManageServices() {
  const { storeId } = useParams();
  useEffect(() => {
    loadServices();
  }, [storeId]);
  
  const loadServices = async () => {
    try {
      const data = await fetchServicesByStore(storeId);
      setServices(
        data.map((s) => ({
          id: s.service_id,
          name: s.service_name,
          category: s.type_name,
          price: s.price,
          time: s.duration_minutes,
          status: true,
        }))
      );
    } catch (err) {
      console.error("โหลดบริการผิดพลาด", err);
    }
  };
    
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([
    { id: 1, name: "เพ้นท์เล็บเจล", category: "เพ้นท์", price: 850, time: 60, status: true },
    { id: 2, name: "ต่อเล็บอะคริลิค", category: "ต่อเล็บ", price: 880, time: 90, status: true },
    { id: 3, name: "สปาเท้า", category: "สปา", price: 860, time: 75, status: true },
    { id: 4, name: "มานิคิวร์", category: "เพ้นท์", price: 850, time: 45, status: true },
    { id: 5, name: "เพ้นท์ลายพิเศษ", category: "เพ้นท์", price: 870, time: 90, status: false },
  ]);

  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [adding, setAdding] = useState(false); // ✅ modal เพิ่มใหม่

  // === แก้ไขบริการ ===
  const handleEditClick = (service) => setEditing({ ...service });
  const handleEditClose = () => setEditing(null);
  const handleEditSave = async () => {
    try {
      await updateServiceAPI(editing.id, {
        service_name: editing.name,
        price: editing.price,
        duration_minutes: editing.time,
        description: "",
        type_id: 1,
        store_id: storeId,
      });
  
      await loadServices();
      setEditing(null);
    } catch (err) {
      console.error("แก้ไขผิดพลาด", err);
    }
  };
  

  // === ลบบริการ ===
  const handleDeleteClick = (service) => setConfirmDelete(service);
  const handleDeleteConfirm = async () => {
    try {
      await deleteServiceAPI(confirmDelete.id);
      await loadServices();
      setConfirmDelete(null);
    } catch (err) {
      console.error("ลบผิดพลาด", err);
    }
  };
  

  // === เพิ่มบริการใหม่ ===
  const handleAddNew = () => {
    setAdding({
      id: Date.now(),
      name: "",
      category: "เพ้นท์",
      price: "",
      time: "",
      status: true,
    });
  };

  const handleAddSave = async () => {
    if (!adding.name || !adding.price || !adding.time) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
  
    try {
      await createService({
        service_name: adding.name,
        price: adding.price,
        duration_minutes: adding.time,
        description: "",
        type_id: 1, // ปรับตามหมวดหมู่จริง
        store_id: storeId,
      });
  
      await loadServices();
      setAdding(null);
    } catch (err) {
      console.error("เพิ่มบริการผิดพลาด", err);
    }
  };
    

  return (
    <div className="admin-root">
      <main className="manage">
        <div className="header">
          <div>
            <h1>จัดการบริการ</h1>
            <p>จัดการบริการทั้งหมดของร้าน</p>
          </div>
          <button className="btn-add" onClick={handleAddNew}>
            <FiPlus style={{ marginRight: "6px" }} /> เพิ่มบริการใหม่
          </button>
        </div>

        <div className="service-card">
          <div className="toolbar">
            <div className="search-box">
              <FiSearch className="icon" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filters">
              <select>
                <option>ทุกหมวดหมู่</option>
                <option>เพ้นท์</option>
                <option>สปา</option>
                <option>ต่อเล็บ</option>
              </select>
              <select>
                <option>ทุกสถานะ</option>
                <option>เปิด</option>
                <option>ปิด</option>
              </select>
            </div>
          </div>

          <table className="service-table">
            <thead>
              <tr>
                <th>ชื่อบริการ</th>
                <th>หมวดหมู่</th>
                <th>ราคา</th>
                <th>ระยะเวลา</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {services
                .filter((s) => s.name.includes(search))
                .map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td><span className="cat">{s.category}</span></td>
                    <td>฿{s.price}</td>
                    <td>{s.time} นาที</td>
                    <td>
                      <span className={`status ${s.status ? "open" : "closed"}`}>
                        {s.status ? "เปิด" : "ปิด"}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn edit" onClick={() => handleEditClick(s)}>
                        <FiEdit2 />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDeleteClick(s)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== Modal เพิ่มบริการ ===== */}
      {adding &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setAdding(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>เพิ่มบริการใหม่</h3>

              <label>ชื่อบริการ</label>
              <input
                type="text"
                placeholder="เช่น เพ้นท์เล็บกลิตเตอร์"
                value={adding.name}
                onChange={(e) => setAdding({ ...adding, name: e.target.value })}
              />

              <label>หมวดหมู่</label>
              <select
                value={adding.category}
                onChange={(e) => setAdding({ ...adding, category: e.target.value })}
              >
                <option>เพ้นท์</option>
                <option>ต่อเล็บ</option>
                <option>สปา</option>
              </select>

              <label>ราคา (บาท)</label>
              <input
                type="number"
                value={adding.price}
                onChange={(e) => setAdding({ ...adding, price: e.target.value })}
              />

              <label>ระยะเวลา (นาที)</label>
              <input
                type="number"
                value={adding.time}
                onChange={(e) => setAdding({ ...adding, time: e.target.value })}
              />

              <label>
                <input
                  type="checkbox"
                  checked={adding.status}
                  onChange={(e) => setAdding({ ...adding, status: e.target.checked })}
                />{" "}
                เปิดให้บริการ
              </label>

              <div className="modal-actions">
                <button onClick={() => setAdding(null)} className="cancel-btn">
                  ยกเลิก
                </button>
                <button onClick={handleAddSave} className="save-btn">
                  บันทึก
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ===== Modal แก้ไข ===== */}
      {editing &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={handleEditClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>แก้ไขบริการ</h3>

              <label>ชื่อบริการ</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />

              <label>หมวดหมู่</label>
              <select
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              >
                <option>เพ้นท์</option>
                <option>ต่อเล็บ</option>
                <option>สปา</option>
              </select>

              <label>ราคา (บาท)</label>
              <input
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
              />

              <label>ระยะเวลา (นาที)</label>
              <input
                type="number"
                value={editing.time}
                onChange={(e) =>
                  setEditing({ ...editing, time: e.target.value })
                }
              />

              <label>
                <input
                  type="checkbox"
                  checked={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.checked })
                  }
                />{" "}
                เปิดให้บริการ
              </label>

              <div className="modal-actions">
                <button onClick={handleEditClose} className="cancel-btn">
                  ยกเลิก
                </button>
                <button onClick={handleEditSave} className="save-btn">
                  บันทึก
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ===== Modal ยืนยันการลบ ===== */}
      {confirmDelete &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal small" onClick={(e) => e.stopPropagation()}>
              <h4>ยืนยันการลบ</h4>
              <p>คุณต้องการลบบริการ “{confirmDelete.name}” หรือไม่?</p>
              <div className="modal-actions">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="cancel-btn"
                >
                  ยกเลิก
                </button>
                <button onClick={handleDeleteConfirm} className="delete-btn">
                  ลบ
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
