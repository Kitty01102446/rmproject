import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Home.jsx";
import AllStores from "./AllStores";
import Store2 from "./Store2";
import Booking from "./Booking";
import Register from "./Register";
import Home2 from "./Home2";
import Analyze from "./Analyze";
import HelpCenter from "./HelpCenter";
import ArticleAcrylic from "./ArticleAcrylic";
import AboutGlamNail from "./AboutGlamNail";
import Articles from "./Articles";
import AddStore from "./AddStore";
import UserProfile from "./UserProfile";


// 🧩 Layout และหน้าแอดมิน
import Navadmin from "./adminstore/navadmin";
import StoreDashboard from "./StoreDashboard";
import ManageServices from "./ManageServices";
import ManageSchedule from "./ManageSchedule";
import ManageEmployees from "./ManageEmployees";
import ManageBookings from "./ManageBookings";
import ManageReviews from "./ManageReviews";
import ManageGallery from "./ManageGallery";
import ManageInventory from "./ManageInventory";
import ManagePromotions from "./ManagePromotions";
import StoreReport from "./StoreReport";
import StoreSettings from "./StoreSettings";

import "./App.css";


export default function App() {
  const location = useLocation();

  // ✅ หน้า “ลูกค้า” เท่านั้น ที่ต้องแสดง Navbar/Footer
  const hideNavAndFooter =
    location.pathname.startsWith("/StoreDashboard") ||
    location.pathname.startsWith("/ManageServices") ||
    location.pathname.startsWith("/ManageSchedule") ||
    location.pathname.startsWith("/ManageEmployees") ||
    location.pathname.startsWith("/ManageBookings") ||
    location.pathname.startsWith("/ManageReviews") ||
    location.pathname.startsWith("/ManageGallery") ||
    location.pathname.startsWith("/ManageInventory") ||
    location.pathname.startsWith("/ManagePromotions") ||
    location.pathname.startsWith("/StoreReport") ||
    location.pathname.startsWith("/StoreSettings");

  return (
    <>
      {!hideNavAndFooter && <Navbar />}

      <div className="page">
        <Routes>
          {/* ======= หน้าเว็บลูกค้าทั่วไป ======= */}
          <Route path="/" element={<Home />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/AllStores" element={<AllStores />} />
          <Route path="/store2/:id" element={<Store2 />} />
          <Route path="/helpCenter" element={<HelpCenter />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/articleAcrylic" element={<ArticleAcrylic />} />
          <Route path="/Articles" element={<Articles />} />
          <Route path="/aboutGlamNail" element={<AboutGlamNail />} />
          <Route path="/addStore" element={<AddStore />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UserProfile" element={<UserProfile />} />

          {/* ======= กลุ่มหน้าฝั่งร้าน (มี Sidebar ของตัวเอง) ======= */}
          <Route path="/" element={<Navadmin />}>

            <Route path="/StoreDashboard/:storeId" element={<Navadmin />}>
              <Route index element={<StoreDashboard />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="schedule" element={<ManageSchedule />} />
              <Route path="employees" element={<ManageEmployees />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="reviews" element={<ManageReviews />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="inventory" element={<ManageInventory />} />
              <Route path="promotions" element={<ManagePromotions />} />
              <Route path="report" element={<StoreReport />} />
              <Route path="settings" element={<StoreSettings />} />
            </Route>


          </Route>

          <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
        </Routes>
      </div>

      {!hideNavAndFooter && <Footer />}
    </>
  );
}
