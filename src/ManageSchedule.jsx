import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ManageSchedule.css";
import { useParams } from "react-router-dom";
import { getEmployeesByStore } from "./callapi/call_api_employee";
import { getScheduleByDate } from "./callapi/call_api_booking";

export default function ManageSchedule() {
  const { storeId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaySchedule, setTodaySchedule] = useState([]);
  useEffect(() => {
    if (!storeId || !selectedDate) return;

    const fetchSchedule = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      try {
        const data = await getScheduleByDate(storeId, formattedDate);

        const mapped = data.map(item => ({
          booking_id: item.booking_id,
          time: item.booking_time,
          task: `ลูกค้า: ${item.customer_name}`,
          employee: item.employee_name
        }));

        setTodaySchedule(mapped);

      } catch (err) {
        console.error(err);
      }
    };

    fetchSchedule();
  }, [storeId, selectedDate]);
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState({ employee: "", time: "", task: "" });

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    if (!storeId) return;

    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesByStore(storeId);

        const formatted = data.map(emp => ({
          id: emp.employee_id,
          name: emp.fullname,
          color: "#e64ba5" // ใส่สี default ไปก่อน
        }));

        setEmployees(formatted);

      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, [storeId]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const assignEmployee = async (bookingId, employeeId) => {
    try {
      await axios.put(
        `http://localhost:5010/booking/${bookingId}/assign`,
        { employee_id: employeeId }
      );

      setSelectedBooking(null);

      // โหลดใหม่
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const data = await getScheduleByDate(storeId, formattedDate);

      setTodaySchedule(
        data.map(item => ({
          booking_id: item.booking_id,
          time: item.booking_time,
          task: `ลูกค้า: ${item.customer_name}`,
          employee: item.employee_name
        }))
      );

    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSchedule = () => {
    const dateKey = selectedDate.toDateString();
    if (!newTask.employee || !newTask.time || !newTask.task) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setSchedules((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));

    setNewTask({ employee: "", time: "", task: "" });
    setAdding(false);
  };


  return (
    <div className="schedule-root">
      <div className="header">
        <div>
          <h1>ตารางงานพนักงาน</h1>
          <p>จัดการตารางงานและเวลาทำงานของพนักงาน</p>
        </div>
        <button
          className="btn-add"
          onClick={() => alert("ตารางงานถูกสร้างจากการจองเท่านั้น")}
        >
          + เพิ่มตารางงานใหม่
        </button>
      </div>

      <div className="schedule-grid">
        {/* ปฏิทิน */}
        <div className="calendar-box">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            locale="th-TH"
          />
        </div>

        {/* ตารางงานในวัน */}
        <div className="day-box">
          <h3>ตารางงาน {selectedDate.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</h3>
          {todaySchedule.map((item, idx) => (
            <li key={idx}>
              <span className="time">{item.time}</span>
              <span className="task">{item.task}</span>

              {item.employee ? (
                <span className="emp">{item.employee}</span>
              ) : (
                <select
                  className="assign-select"
                  onChange={(e) =>
                    assignEmployee(item.booking_id, e.target.value)
                  }
                >
                  <option value="">เลือกพนักงาน</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </div>

        {/* รายชื่อพนักงาน */}
        <div className="emp-box">
          <h3>พนักงานที่ว่าง</h3>
          <ul>
            {employees.map((e) => (
              <li key={e.name}>
                <span className="dot" style={{ background: e.color }}></span>
                {e.name} <span className="status">ว่าง</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal เพิ่มตารางงาน */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>เลือกพนักงานให้ลูกค้า</h3>

            <p>ลูกค้า: {selectedBooking.task}</p>

            <label>ชื่อพนักงาน</label>
            <select
              onChange={(e) =>
                assignEmployee(selectedBooking.booking_id, e.target.value)
              }
            >
              <option value="">-- เลือกพนักงาน --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={() => setSelectedBooking(null)}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
