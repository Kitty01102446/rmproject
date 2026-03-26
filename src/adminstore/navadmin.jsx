import React from "react";
import { Outlet, NavLink, useParams } from "react-router-dom";
import "./navadmin.css";

export default function StoreLayout() {

    const { storeId } = useParams();
  
    return (
      <div className="admin-root">
        <aside className="sidebar">
          <div className="logo">
            <span>Nail Salon Pro</span>
          </div>
  
          <nav className="menu">
            <NavLink to={`/StoreDashboard/${storeId}`}>แดชบอร์ดร้าน</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/services`}>จัดการบริการ</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/schedule`}>ตารางพนักงาน</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/employees`}>จัดการพนักงาน</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/bookings`}>การจอง</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/reviews`}>รีวิวและคะแนน</NavLink>
           {/* <NavLink to={`/StoreDashboard/${storeId}/gallery`}>คลังรูปภาพร้าน</NavLink>
            <NavLink to={`/StoreDashboard/${storeId}/inventory`}>คลังอุปกรณ์ร้าน</NavLink> */}
            <NavLink to={`/StoreDashboard/${storeId}/promotions`}>โปรโมชั่นและแพ็กเกจ</NavLink>
            {/* <NavLink to={`/StoreDashboard/${storeId}/report`}>รายงานร้าน</NavLink> */}
            <NavLink to={`/StoreDashboard/${storeId}/settings`}>การตั้งค่าร้าน</NavLink>
          </nav>
        </aside>
  
        <main className="dashboard">
          <Outlet />
        </main>
      </div>
    );
  }