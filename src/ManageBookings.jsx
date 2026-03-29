import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiEye, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import ReactDOM from "react-dom";
import "./ManageBookings.css";

export default function ManageBookings() {
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { storeId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, [storeId]);

  const loadBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5010/booking/store/${storeId}`
      );
      setBookings(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("โหลดการจองผิดพลาด", err);
    }
  };


  const updateStatus = async (id, statusId) => {
    try {
      await axios.put(
        `http://localhost:5010/bookings/${id}/status`,
        { status_booking_id: statusId }
      );      
      loadBookings(); // รีโหลดข้อมูลใหม่
    } catch (err) {
      console.error("อัปเดตสถานะผิดพลาด", err);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5010/booking/${id}`
      );

      loadBookings();
    } catch (err) {
      console.error("ลบผิดพลาด", err);
    }
  };

  const statusClass = (status) => {
    if (!status) return "status pending";
  
    const s = status.toLowerCase();
  
    if (s.includes("confirm")) return "status confirmed";
    if (s.includes("done") || s.includes("เสร็จ")) return "status done";
    if (s.includes("cancel") || s.includes("ยกเลิก")) return "status canceled";
  
    return "status pending";
  };

  const filteredBookings = bookings.filter((b) =>
    (b.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
    String(b.booking_id).includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / bookingsPerPage));
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const visibleBookings = filteredBookings.slice(startIndex, startIndex + bookingsPerPage);
  

  return (
    <>
      <section className="manage manage-bookings-page">
        <div className="header">
          <div>
            <h1>การจอง</h1>
            <p>จัดการข้อมูลการจองทั้งหมดของร้าน</p>
          </div>
        </div>

        <div className="service-card">
          <div className="toolbar">
            <div className="search-box">
              <FiSearch className="icon" />
              <input
                type="text"
                placeholder="ค้นหาการจองหรือชื่อลูกค้า..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <table className="service-table">
            <thead>
              <tr>
                <th>หมายเลขการจอง</th>
                <th>ชื่อลูกค้า</th>
                <th>บริการ</th>
                <th>พนักงาน</th>
                <th>วันที่</th>
                <th>เวลา</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td>{b.booking_id}</td>
                    <td>{b.customer_name}</td>
                    <td>{b.services || "-"}</td>
                    <td>{b.employee_name || "-"}</td>
                    <td>{b.booking_date}</td>
                    <td>{b.booking_time}</td>
                    <td>
                      <span className={statusClass(b.status_booking_name)}>
                        {b.status_booking_name}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="icon-btn view">
                        <FiEye />
                      </button>

                      <button
                        className="icon-btn confirm"
                        onClick={() => updateStatus(b.booking_id, 2)}
                      >
                        <FiCheck />
                      </button>

                      <button
                        className="icon-btn cancel"
                        onClick={() => updateStatus(b.booking_id, 4)}
                      >
                        <FiX />
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => deleteBooking(b.booking_id)}
                      >
                        <FiTrash2 />
                      </button>


                    </td>

                  </tr>
                ))}
            </tbody>
          </table>

          {filteredBookings.length > bookingsPerPage && (
            <div className="pagination-bar">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                ก่อนหน้า
              </button>

              <div className="page-info">
                หน้า {currentPage} / {totalPages}
              </div>

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal รายละเอียดการจอง */}
      {selectedBooking &&
        ReactDOM.createPortal(
          <div
            className="modal-overlay"
            onClick={() => setSelectedBooking(null)}
          >
            <div className="modal booking-modal" onClick={(e) => e.stopPropagation()}>
              <h3>รายละเอียดการจอง</h3>
              <div className="booking-detail">
                <p><strong>หมายเลขการจอง:</strong> {selectedBooking.id}</p>
                <p><strong>ชื่อลูกค้า:</strong> {selectedBooking.customer}</p>
                <p><strong>เบอร์โทรศัพท์:</strong> {selectedBooking.phone}</p>
                <p><strong>บริการ:</strong> {selectedBooking.service}</p>
                <p><strong>พนักงาน:</strong> {selectedBooking.employee}</p>
                <p><strong>วันที่:</strong> {selectedBooking.date}</p>
                <p><strong>เวลา:</strong> {selectedBooking.time}</p>
                <p>
                  <strong>สถานะ:</strong>{" "}
                  <span className={statusClass(selectedBooking.status)}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="cancel-btn"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
