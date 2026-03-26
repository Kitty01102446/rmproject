import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FiMessageSquare } from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./ManageReviews.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ManageReviews() {
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");

  const reviews = [
    {
      id: 1,
      name: "สมหญิง ใจดี",
      date: "26/10/2568",
      rating: 5,
      text: "บริการดีมาก พนักงานใจดี เล็บสวยมาก ประทับใจค่ะ",
      pinned: true,
    },
    {
      id: 2,
      name: "วิไล สวยงาม",
      date: "25/10/2568",
      rating: 4,
      text: "ดีค่ะ แต่อาจรอนานหน่อย",
    },
    {
      id: 3,
      name: "นภา รักสวย",
      date: "24/10/2568",
      rating: 5,
      text: "สวยมากค่ะ ชอบมาก จะกลับมาใช้บริการอีกแน่นอน",
    },
    {
      id: 4,
      name: "ปรียา มั่งมี",
      date: "23/10/2568",
      rating: 5,
      text: "ช่างทำดีมากค่ะ เล็บสวย ทนมาก",
    },
  ];

  const average = 4.8;

  const chartData = {
    labels: ["มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."],
    datasets: [
      {
        label: "คะแนนเฉลี่ย",
        data: [4.3, 4.5, 4.6, 4.75, 4.8],
        fill: false,
        borderColor: "#ff6b98",
        backgroundColor: "#ff6b9833",
        tension: 0.3,
      },
    ],
  };

  const handleSendReply = () => {
    alert("ส่งคำตอบกลับเรียบร้อย!");
    setReplying(null);
    setReplyText("");
  };

  return (
    <div className="admin-root">
      <main className="manage">
        {/* ===== ส่วนหัว ===== */}
        <div className="header">
          <div>
            <h1>รีวิวและฟีดแบ็ก</h1>
            <p>ดูและตอบกลับรีวิวจากลูกค้า</p>
          </div>
        </div>

        {/* ===== สรุปคะแนนรีวิว ===== */}
        <div className="review-summary">
          <div className="card avg-card">
            <h3>⭐ คะแนนรีวิวเฉลี่ย</h3>
            <p className="avg-score">
              <span className="score">{average}</span> / 5.0
            </p>
            <p className="small">จาก 4 รีวิว</p>
            <p className="up">⬆ เพิ่มขึ้น 0.1 คะแนนจากเดือนที่แล้ว</p>
          </div>
          <div className="card chart-card">
            <h3>แนวโน้มคะแนนรีวิว</h3>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { min: 4, max: 5 } },
              }}
            />
          </div>
        </div>

        {/* ===== ตารางรีวิวทั้งหมด ===== */}
        <div className="service-card">
          <h3>รีวิวทั้งหมด</h3>
          <table className="service-table">
            <thead>
              <tr>
                <th>ชื่อลูกค้า</th>
                <th>วันที่</th>
                <th>คะแนน</th>
                <th>ข้อความรีวิว</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.name} {r.pinned && <span className="pin">📌</span>}
                  </td>
                  <td>{r.date}</td>
                  <td>{"⭐".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                  <td>{r.text}</td>
                  <td className="action-buttons">
                    <button className="icon-btn" onClick={() => setReplying(r)}>
                      <FiMessageSquare />
                    </button>
                    <button className="icon-btn">
                      <FaThumbtack />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== Modal ตอบกลับรีวิว ===== */}
        {replying &&
          ReactDOM.createPortal(
            <div className="modal-overlay" onClick={() => setReplying(null)}>
              <div className="modal small" onClick={(e) => e.stopPropagation()}>
                <h3>ตอบกลับรีวิว</h3>
                <p><strong>ลูกค้า:</strong> {replying.name}</p>
                <p><strong>คะแนน:</strong> {"⭐".repeat(replying.rating)}</p>
                <p><strong>รีวิว:</strong> {replying.text}</p>

                <label>การตอบกลับของคุณ</label>
                <textarea
                  placeholder="พิมพ์คำตอบของคุณที่นี่..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setReplying(null)}>
                    ยกเลิก
                  </button>
                  <button className="save-btn" onClick={handleSendReply}>
                    ส่งคำตอบ
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
