import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, createBooking } from "./callapi/call_api_booking";
import { getEmployeeByStore } from "./callapi/call_api_employee";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "./Booking.css";

export default function BookingPage() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tech, setTech] = useState(null);
  const [dateObj, setDateObj] = useState(null);
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [agree, setAgree] = useState(false);
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cLine, setCLine] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cNote, setCNote] = useState("");
  const [activeKey, setActiveKey] = useState("services");
  const [bookedTimes, setBookedTimes] = useState([]);
  useEffect(() => {

    if (!tech || !dateStr) return;

    async function fetchBookedTimes() {

      const res = await fetch(
        `http://localhost:5010/booking/employee/${tech}/${dateStr}`
      );

      const data = await res.json();

      const times = data.map(t => t.booking_time);

      setBookedTimes(times);
    }

    fetchBookedTimes();

  }, [tech, dateStr]);

  const today = new Date();
  const stepRefs = {
    services: useRef(null),
    tech: useRef(null),
    datetime: useRef(null),
    customer: useRef(null),
  };

  useEffect(() => {
    const p = JSON.parse(sessionStorage.getItem("bookingPayload") || "null");
    if (p) {
      setPayload(p);
      setCheckedIds((p.services || []).map(s => s.id));
    }
  }, []);

  useEffect(() => {
    if (dateObj) setDateStr(dateObj.toISOString().split("T")[0]);
  }, [dateObj]);

  useEffect(() => {
    if (!payload?.storeId) return;
    async function fetchEmployees() {
      try {
        const res = await getEmployeeByStore(payload.storeId);
        setEmployees(res || []);
      } catch (err) { console.error(err); }
    }
    fetchEmployees();
  }, [payload]);

  const allServices = useMemo(() => payload?.services || [], [payload]);
  const chosen = useMemo(() => allServices.filter(s => checkedIds.includes(s.id)), [allServices, checkedIds]);
  const totalMins = chosen.reduce((acc, s) => acc + Number(s.minutes || 0), 0);
  const totalPrice = chosen.reduce((acc, s) => acc + Number(s.price || 0), 0);

  const thb = (n) => "฿" + Number(n || 0).toLocaleString();

  const stepValid = {
    services: chosen.length > 0,
    tech: true,
    datetime: !!dateStr && !!timeStr,
    customer: cName.trim().length >= 2 && /^0\d{8,9}$/.test(cPhone.replace(/\D/g, "")),
  };

  const canConfirm = stepValid.services && stepValid.datetime && stepValid.customer && agree;

  const scrollTo = (key) => {
    stepRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveKey(key);
  };

  const handleAutofill = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.user_id) return;
      const user = await getUserById(storedUser.user_id);
      setCName(user.nickname || user.username || "");
      setCPhone(user.phone || "");
      setCEmail(user.email || "");
    } catch (err) { console.error(err); }
  };

  const confirmBooking = async () => {
    try {

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        Swal.fire("แจ้งเตือน", "กรุณาเข้าสู่ระบบก่อนจอง", "warning");
        return;
      }

      const payloadSend = {
        booking_date: dateStr,
        booking_time: timeStr,
        user_id: storedUser.user_id,
        store_id: Number(payload.storeId),   // 👈 ป้องกัน type error
        employee_id: tech,
        customer: {
          name: cName,
          phone: cPhone,
          line: cLine,
          email: cEmail,
          note: cNote
        },
        services: chosen.map(s => ({
          service_id: s.id,
          name: s.name,
          price: s.price,
          minutes: s.minutes
        })),
        total_price: totalPrice,
        total_minutes: totalMins,
        type_booking_id: 1,
        status_booking_id: 1
      };

      await createBooking(payloadSend);

      Swal.fire({
        title: "จองคิวสำเร็จ",
        html: `<p>${payload.storeName}</p>
               <p>วันที่ ${dateStr} เวลา ${timeStr}</p>
               <h3>${thb(totalPrice)}</h3>`,
        icon: "success",
        confirmButtonColor: "#2D4A43"
      }).then(() => navigate("/AllStores"));

    } catch (err) {

      console.log("BOOKING ERROR:", err.response?.data);

      const message =
        err.response?.data?.error ||
        "ไม่สามารถบันทึกการจองได้";

      Swal.fire(
        "ไม่สามารถจองได้",
        message,
        "warning"
      );
    }
  };

  return (
    <div className="bk-editorial-root">
      <header className="bk-header">
        <div className="bk-container">
          <div className="bk-header-flex">
            <div className="bk-title-area">
              <span className="bk-tag">CONFIRM YOUR SELECTION</span>
              <h1 className="bk-main-title">{payload?.storeName || "ATELIER"} <em></em></h1>
            </div>
            <nav className="bk-stepper">
              {["services", "tech", "datetime", "customer"].map((key, idx) => (
                <div key={key} className={`bk-step-node ${activeKey === key ? "active" : ""} ${stepValid[key] ? "done" : ""}`} onClick={() => scrollTo(key)}>
                  <span className="bk-step-num">0{idx + 1}</span>
                  <span className="bk-step-label">{key.toUpperCase()}</span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="bk-container bk-content-layout">
        <div className="bk-forms-column">
          <section ref={stepRefs.services} className="bk-section">
            <h2 className="bk-section-title">Selected Treatments</h2>
            <div className="bk-svc-list">
              {chosen.map(s => (
                <div key={s.id} className="bk-svc-row">
                  <div className="bk-svc-info">
                    <div className="bk-check-dot" />
                    <span className="bk-svc-name">{s.name}</span>
                  </div>
                  <span className="bk-svc-price">{thb(s.price)}</span>
                </div>
              ))}
            </div>
          </section>

          <section ref={stepRefs.tech} className="bk-section">
            <h2 className="bk-section-title">Professional Selection</h2>
            <div className="bk-tech-flex">
              <div className={`bk-tech-card ${tech === null ? 'active' : ''}`} onClick={() => setTech(null)}>
                <div className="bk-tech-avatar"><span style={{ fontSize: '20px' }}>?</span></div>
                <label>System Match</label>
              </div>
              {employees.map(emp => (
                <div key={emp.employee_id} className={`bk-tech-card ${tech === emp.employee_id ? 'active' : ''}`} onClick={() => setTech(emp.employee_id)}>
                  <div className="bk-tech-avatar">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" alt={emp.fullname} />
                  </div>
                  <label>{emp.fullname}</label>
                </div>
              ))}
            </div>
          </section>

          <section ref={stepRefs.datetime} className="bk-section">
            <h2 className="bk-section-title">Date & Time</h2>
            <div className="bk-dt-grid">
              <div className="bk-input-group">
                <label>Appointment Date</label>
                <DatePicker selected={dateObj} onChange={date => setDateObj(date)} minDate={today} dateFormat="dd/MM/yyyy" className="bk-input" placeholderText="Choose Date" />
              </div>
              <div className="bk-input-group">
                <label>Preferred Time</label>
                <select
                  className="bk-input"
                  value={timeStr}
                  onChange={e => setTimeStr(e.target.value)}
                >
                  <option value="">Select Time</option>

                  {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(t => (

                    <option
                      key={t}
                      value={t}
                      disabled={bookedTimes.includes(t)}
                    >
                      {t} {bookedTimes.includes(t) ? "(เต็ม)" : ""}
                    </option>

                  ))}

                </select>
              </div>
            </div>
          </section>

          <section ref={stepRefs.customer} className="bk-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 className="bk-section-title">Personal Information</h2>
              <button className="bk-autofill-btn" onClick={handleAutofill}>AUTOFIL USER DATA</button>
            </div>
            <div className="bk-dt-grid">
              <div className="bk-input-group">
                <label>Name</label>
                <input className="bk-input" value={cName} onChange={e => setCName(e.target.value)} placeholder="Full Name" />
              </div>
              <div className="bk-input-group">
                <label>Phone</label>
                <input className="bk-input" value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="0xx-xxx-xxxx" />
              </div>
            </div>
          </section>
        </div>

        <aside className="bk-sidebar">
          <div className="bk-summary-sticky">
            <h4 className="bk-summary-title">RESERVATION SUMMARY</h4>
            <div className="bk-summary-content">
              {chosen.map(s => (
                <div key={s.id} className="bk-summary-row">
                  <span>{s.name}</span>
                  <span>{thb(s.price)}</span>
                </div>
              ))}
            </div>

            <div className="bk-total-area">
              <div className="bk-total-row">
                <span style={{ fontSize: '10px', letterSpacing: '1px' }}>TOTAL AMOUNT</span>
                <span className="bk-total-price">{thb(totalPrice)}</span>
              </div>
              <span className="bk-total-mins">{totalMins} Minutes Service</span>
            </div>

            <label className="bk-checkbox-label">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>I accept the booking policy.</span>
            </label>

            <button className="bk-btn-confirm" disabled={!canConfirm} onClick={confirmBooking}>
              CONFIRM BOOKING
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
