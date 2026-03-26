import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiDownload } from "react-icons/fi";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import "./ManageEmployees.css";
import { getEmployeesByStore, createEmployee, updateEmployee, deleteEmployee } from "./callapi/call_api_employee";

export default function ManageEmployees() {
  const { storeId } = useParams();
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    if (!storeId) return;

    const fetchEmployee = async () => {
      try {
        const data = await getEmployeesByStore(storeId);

        const formatted = data.map(emp => ({
          id: emp.employee_id,
          name: emp.fullname,
          role: emp.position,
          phone: emp.phone,
          email: emp.email || "-",
          start: emp.start_date,
          status: "ทำงานอยู่"
        }));

        setEmployees(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployee();
  }, [storeId]);

  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSave = async () => {
    try {
      if (adding) {
        await createEmployee({
          fullname: editing.name,
          phone: editing.phone,
          email: editing.email,
          position: editing.role,
          store_id: storeId
        });
      } else {
        await updateEmployee(editing.id, {
          fullname: editing.name,
          phone: editing.phone,
          email: editing.email,
          position: editing.role,
          store_id: storeId
        });
      }

      setEditing(null);
      setAdding(false);

      // โหลดข้อมูลใหม่จาก DB
      const data = await getEmployeesByStore(storeId);

      const formatted = data.map(emp => ({
        id: emp.employee_id,
        name: emp.fullname,
        role: emp.position,
        phone: emp.phone,
        email: emp.email || "-",
        start: emp.start_date,
        status: "ทำงานอยู่"
      }));

      setEmployees(formatted);

    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="admin-root">
      <main className="manage">
        <div className="header">
          <div>
            <h1>จัดการพนักงาน</h1>
            <p>จัดการข้อมูลพนักงานทั้งหมด</p>
          </div>
          <div className="header-actions">
            <button className="btn-export">
              <FiDownload /> ส่งออก CSV
            </button>
            <button
              className="btn-add"
              onClick={() => {
                setAdding(true);
                setEditing({
                  name: "",
                  role: "",
                  phone: "",
                  email: "",
                  start: "",
                  status: "ทำงานอยู่",
                });
              }}
            >
              + เพิ่มพนักงานใหม่
            </button>
          </div>
        </div>

        <div className="service-card">
          <div className="toolbar">
            <div className="search-box">
              <FiSearch className="icon" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="service-table">
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อพนักงาน</th>
                <th>ตำแหน่ง</th>
                <th>เบอร์โทรศัพท์</th>
                <th>อีเมล</th>
                <th>วันที่เริ่มงาน</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .filter((e) => e.name.includes(search))
                .map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="avatar">{e.name[0]}</div>
                    </td>
                    <td>{e.name}</td>
                    <td>{e.role}</td>
                    <td>{e.phone}</td>
                    <td>{e.email}</td>
                    <td>{e.start}</td>
                    <td>
                      <span className="status open">{e.status}</span>
                    </td>
                    <td>
                      <button
                        className="icon-btn edit"
                        onClick={() => setEditing({ ...e })}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => setConfirmDelete(e)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ===== Modal แก้ไข / เพิ่ม ===== */}
      {editing &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{adding ? "เพิ่มพนักงานใหม่" : "แก้ไขข้อมูลพนักงาน"}</h3>

              <label>ชื่อพนักงาน</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />

              <label>ตำแหน่ง</label>
              <input
                type="text"
                value={editing.role}
                onChange={(e) =>
                  setEditing({ ...editing, role: e.target.value })
                }
              />

              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={editing.phone}
                onChange={(e) =>
                  setEditing({ ...editing, phone: e.target.value })
                }
              />

              <label>อีเมล</label>
              <input
                type="email"
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
              />

              <label>วันที่เริ่มงาน</label>
              <input
                type="text"
                value={editing.start}
                onChange={(e) =>
                  setEditing({ ...editing, start: e.target.value })
                }
              />

              <div className="modal-actions">
                <button onClick={() => setEditing(null)} className="cancel-btn">
                  ยกเลิก
                </button>
                <button onClick={handleSave} className="save-btn">
                  บันทึก
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ===== Modal ยืนยันลบ ===== */}
      {confirmDelete &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal small" onClick={(e) => e.stopPropagation()}>
              <h4>ยืนยันการลบ</h4>
              <p>ต้องการลบ “{confirmDelete.name}” หรือไม่?</p>
              <div className="modal-actions">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="cancel-btn"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={async () => {
                    try {
                      await deleteEmployee(confirmDelete.id);

                      setEmployees(prev =>
                        prev.filter(x => x.id !== confirmDelete.id)
                      );

                      setConfirmDelete(null);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="delete-btn"
                >
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
