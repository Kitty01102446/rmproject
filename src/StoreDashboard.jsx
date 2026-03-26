import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import { FiDownload } from "react-icons/fi";
import "./StoreDashboard.css";
import { useParams } from "react-router-dom";
import { getStoreBookings, getAlerts } from "./callapi/call_api_booking.jsx";
import { getTopServices, getMonthlyIncomeByYear, getTopServicess } from "./callapi/call_api_service.jsx";


export default function StoreDashboard() {

  const { storeId } = useParams();
  console.log("Store ID:", storeId);
  // Data สำหรับ Dashboard
  const data = [
    { name: "เพ้นท์เล็บเจล", value: 32 },
    { name: "ต่อเล็บ", value: 28 },
    { name: "สปาเท้า", value: 25 },
    { name: "มาส์กมือ", value: 21 },
    { name: "เพ้นท์ลายตามสั่ง", value: 20 },
  ];

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    if (!storeId) return;

    const fetchBookings = async () => {
      try {
        const data = await getStoreBookings(storeId);
        console.log("Store bookings:", data);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [storeId]);

  const [topServices, setTopServices] = useState([]);
  useEffect(() => {
    if (!storeId) return;

    const fetchTopServices = async () => {
      try {
        const data = await getTopServices(storeId);
        setTopServices(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopServices();
  }, [storeId]);

  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    if (!storeId) return;
  
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts(storeId);
  
        const formatted = data.map(item => ({
          text: `มีการจองใหม่จาก ${item.customer_name}`,
          time: formatTimeAgo(item.created_at)
        }));
  
        setAlerts(formatted);
  
      } catch (err) {
        console.error(err);
      }
    };
    function formatTimeAgo(dateString) {
      const now = new Date();
      const past = new Date(dateString);
      const diff = Math.floor((now - past) / 1000);
    
      if (diff < 60) return "เมื่อสักครู่";
      if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
      return `${Math.floor(diff / 86400)} วันที่แล้ว`;
    }
  
    fetchAlerts();
  }, [storeId]);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [incomeTrend, setIncomeTrend] = useState([]);
  // Data สำหรับ Report (สมมติเพื่อใช้กับ Recharts)
  useEffect(() => {
    if (!storeId) return;

    const fetchIncome = async () => {
      try {
        const data = await getMonthlyIncomeByYear(storeId, selectedYear);

        const thaiMonths = [
          "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
          "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];

        // เติม 12 เดือนให้ครบ
        const fullYear = Array.from({ length: 12 }, (_, i) => {
          const found = data.find(d => d.month_number === i + 1);
          return {
            month: thaiMonths[i],
            income: found ? Number(found.income) : 0
          };
        });

        setIncomeTrend(fullYear);

      } catch (err) {
        console.error(err);
      }
    };

    fetchIncome();
  }, [storeId, selectedYear]);

  const [topServicess, setTopServicess] = useState([]);
  useEffect(() => {
    if (!storeId) return;
  
    const fetchTopServicess = async () => {
      try {
        const data = await getTopServicess(storeId);
  
        // แปลง format ให้ตรงกับ BarChart
        const formatted = data.map(item => ({
          name: item.service_name,
          value: Number(item.total_sales)
        }));
  
        setTopServicess(formatted);
  
      } catch (err) {
        console.error("Top services error:", err);
      }
    };
  
    fetchTopServicess();
  }, [storeId]);
   
  return (
    <div className="admin-root report-page">
      <main className="dashboard report">
        {/* ===== ส่วนที่ 1: Header รายงานร้าน ===== */}
        <div className="header">
          <div>
            <h1>รายงานร้าน & แดชบอร์ด</h1>
            <p className="subtitle">สรุปภาพรวมและข้อมูลสถิติวันนี้</p>
          </div>
          <div className="actions">
            <select>
              <option>รายเดือน</option>
              <option>รายไตรมาส</option>
              <option>รายปี</option>
            </select>
            <button className="btn-export"><FiDownload /> Excel</button>
            <button className="btn-export"><FiDownload /> PDF</button>
          </div>
        </div>

        {/* ===== ส่วนที่ 2: Stats Cards (จาก Dashboard) ===== */}
        <div className="stats-grid">
          <div className="card">
            <p className="label">ยอดจองวันนี้</p>
            <h2>24</h2>
            <span className="trend up">↑ +12% จากเมื่อวาน</span>
          </div>
          <div className="card">
            <p className="label">รายได้วันนี้</p>
            <h2>฿18,450</h2>
            <span className="trend up">↑ +8% จากเมื่อวาน</span>
          </div>
          <div className="card">
            <p className="label">รีวิวเฉลี่ย</p>
            <h2>4.8</h2>
            <span>จาก 156 รีวิว</span>
          </div>
          <div className="card">
            <p className="label">ลูกค้าใหม่เดือนนี้</p>
            <h2>32</h2>
            <span className="trend up">↑ +18% จากเดือนที่แล้ว</span>
          </div>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[0, 1, 2].map(i => {
            const year = currentYear - i;
            return (
              <option key={year} value={year}>
                {year + 543}
              </option>
            );
          })}
        </select>
        {/* ===== ส่วนที่ 3: กราฟรายได้ (จาก Report) ===== */}
        <section className="chart-section card">
          <h3>รายได้รายเดือน</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={incomeTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#ff6b98" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ===== ส่วนที่ 4: Grid ตาราง (รวมของเดิม) ===== */}
        <div className="grid-2">
          {/* บริการยอดนิยม (Bar Chart) */}
          <div className="card full">
            <h3>บริการยอดนิยม (Top 5 Services)</h3>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topServicess}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff6b98" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* การจองล่าสุด */}
          <div className="card">
            <h3>การจองล่าสุด</h3>
            <table className="booking-table">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เวลา</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={i}>
                    <td>{b.customer_name}</td>
                    <td>{b.booking_time}</td>
                    <td>
                      <span
                        className={`status ${b.status_booking_name === "ยืนยันแล้ว"
                          ? "confirmed"
                          : b.status_booking_name === "รอยืนยัน"
                            ? "pending"
                            : "done"
                          }`}
                      >
                        {b.status_booking_name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== ส่วนที่ 5: ตารางบริการ + พนักงาน (จาก Report) ===== */}
        <div className="table-row">
          <div className="table-card card">
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
                {topServices.map((s, i) => (
                  <tr key={i}>
                    <td>{s.service_name}</td>
                    <td>{s.total_sales}</td>
                    <td>฿{Number(s.total_revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card card">
            <h3>พนักงานที่มียอดจองสูงสุด</h3>
            <table>
              <thead>
                <tr><th>พนักงาน</th><th>การจอง</th><th>คะแนน</th></tr>
              </thead>
              <tbody>
                <tr><td>วิภา ศิริมิช่วย</td><td>85</td><td>⭐ 4.9</td></tr>
                <tr><td>สุชา เส้นสวย</td><td>78</td><td>⭐ 4.8</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== ส่วนที่ 6: การแจ้งเตือน ===== */}
        <div className="card alerts">
          <h3>การแจ้งเตือนจากระบบ</h3>
          <ul>
            {alerts.map((a, i) => (
              <li key={i}>
                <p>{a.text}</p>
                <span>{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Padding ท้ายหน้าเพื่อให้ Scroll พ้นขอบ */}
        <div style={{ height: "50px" }}></div>
      </main>
    </div>
  );
}