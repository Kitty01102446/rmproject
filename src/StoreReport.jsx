import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FiDownload, FiBarChart2 } from "react-icons/fi";
import "./StoreReport.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend
);

export default function StoreReport() {
  // 🔹 กราฟรายได้รายเดือน
  const incomeData = {
    labels: ["มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."],
    datasets: [
      {
        label: "รายได้ (บาท)",
        data: [130000, 135000, 145000, 155000, 175000],
        borderColor: "#ff6b98",
        backgroundColor: "#ff6b98",
        tension: 0.4,
        fill: false,
        pointRadius: 5,
      },
    ],
  };

  const incomeOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f3f4f6" } },
    },
  };

  // 🔹 กราฟรีวิวเฉลี่ยรายเดือน
  const reviewData = {
    labels: [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ],
    datasets: [
      {
        label: "คะแนนเฉลี่ย",
        data: [4.4, 4.5, 4.6, 4.5, 4.6, 4.5, 4.6, 4.7, 4.7, 4.8, 4.9, 4.8], // ✅ 12 ค่า
        backgroundColor: "#ff6b98",
        borderRadius: 8,
      },
    ],
  };
  
  

  const reviewOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        grid: { color: "#f3f4f6" },
      },
    },
  };

  return (
    <div className="report-page admin-root">
      <main className="report">
        <div className="header">
          <div>
            <h1>รายงานร้าน</h1>
            <p>สรุปภาพรวมและข้อมูลสถิติ</p>
          </div>

          <div className="actions">
            <select>
              <option>รายเดือน</option>
              <option>รายไตรมาส</option>
              <option>รายปี</option>
            </select>
            <button className="btn-export">
              <FiDownload /> Excel
            </button>
            <button className="btn-export">
              <FiDownload /> PDF
            </button>
          </div>
        </div>

        {/* กราฟรายได้ */}
        <section className="chart-section">
          <h3>รายได้รายเดือน</h3>
          <div className="chart-box">
            <Line data={incomeData} options={incomeOptions} />
          </div>
        </section>

        {/* ตารางบริการ + พนักงาน */}
        <div className="table-row">
          <div className="table-card">
            <h3>บริการที่ขายดี</h3>
            <table>
              <thead>
                <tr>
                  <th>บริการ</th>
                  <th>ยอดขาย</th>
                  <th>รายได้</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>เพ้นท์เล็บเจล</td>
                  <td>156</td>
                  <td>฿878,000</td>
                </tr>
                <tr>
                  <td>ต่อเล็บอะคริลิค</td>
                  <td>98</td>
                  <td>฿878,400</td>
                </tr>
                <tr>
                  <td>สปามือ</td>
                  <td>87</td>
                  <td>฿852,200</td>
                </tr>
                <tr>
                  <td>มานิคัวร์</td>
                  <td>76</td>
                  <td>฿826,600</td>
                </tr>
                <tr>
                  <td>เพ้นท์ลายพิเศษ</td>
                  <td>54</td>
                  <td>฿837,800</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h3>พนักงานที่มียอดจองสูงสุด</h3>
            <table>
              <thead>
                <tr>
                  <th>พนักงาน</th>
                  <th>การจอง</th>
                  <th>คะแนน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>วิภา ศิริมิช่วย</td>
                  <td>85</td>
                  <td>⭐ 4.9</td>
                </tr>
                <tr>
                  <td>สุชา เส้นสวย</td>
                  <td>78</td>
                  <td>⭐ 4.8</td>
                </tr>
                <tr>
                  <td>มาลี เพิ่มศรี</td>
                  <td>65</td>
                  <td>⭐ 4.7</td>
                </tr>
                <tr>
                  <td>นิภา ดีไซน์</td>
                  <td>52</td>
                  <td>⭐ 4.8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* รีวิวเฉลี่ยรายเดือน */}
        <section className="chart-section">
          <h3>รีวิวเฉลี่ยต่อเดือน</h3>
          <div className="chart-box">
            <Bar data={reviewData} options={reviewOptions} />
          </div>
        </section>

        {/* การ์ดสรุปสถิติ */}
        <div className="summary-cards">
          <div className="card">
            <p className="label">รายได้รวมเดือนนี้</p>
            <h3>฿175,000</h3>
            <span className="positive">+8.0% จากเดือนที่ผ่านมา</span>
          </div>
          <div className="card">
            <p className="label">การจองรวม</p>
            <h3>138</h3>
            <span className="positive">+10.4% จากเดือนที่ผ่านมา</span>
          </div>
          <div className="card">
            <p className="label">ลูกค้าใหม่</p>
            <h3>32</h3>
            <span className="positive">+18.5% จากเดือนที่ผ่านมา</span>
          </div>
          <div className="card">
            <p className="label">คะแนนเฉลี่ย</p>
            <h3>4.8 / 5.0</h3>
            <span className="positive">+0.1 จากเดือนที่ผ่านมา</span>
          </div>
        </div>
      </main>
    </div>
  );
}
