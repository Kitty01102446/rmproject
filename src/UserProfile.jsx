import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getStores } from "./callapi/call_api_user.jsx";
import { FiUser, FiPhone, FiMail, FiCalendar, FiClock, FiLogOut, FiEdit3 } from "react-icons/fi";
import "./UserProfile.css";
import { getUserById, updateUserById, getUserBookings } from "./callapi/call_api_userprofile.jsx";
import { getStoreByUser } from "./callapi/call_api_userprofile.jsx";

export default function UserProfile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("bookings");
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [profile, setProfile] = useState({
    avatar: localStorage.getItem("pf_avatar") || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    username: "", name: "", phone: "", email: "",
  });
  const [hasStore, setHasStore] = useState(false);
  const [storeData, setStoreData] = useState(null);


  const [editModal, setEditModal] = useState({ open: false, field: "", label: "", value: "" });

  useEffect(() => {
    async function fetchData() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.user_id) {
          navigate("/login");
          return;
        }

        const [userData, bookingData, storeRes] = await Promise.all([
          getUserById(storedUser.user_id),
          getUserBookings(storedUser.user_id),
          getStoreByUser(storedUser.user_id)
        ]);

        setProfile(prev => ({
          ...prev,
          username: userData.username,
          name: userData.nickname || "Not set",
          phone: userData.phone || "Not set",
          email: userData.email,
        }));

        setBookings(bookingData);

        if (storeRes.has_store) {
          setHasStore(true);
          setStoreData(storeRes.store);
        }

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  useEffect(() => {
    async function loadFavorites() {
      const favIds = JSON.parse(localStorage.getItem("my_favorites")) || [];
      if (favIds.length === 0) {
        setFavoriteStores([]);
        return;
      }

      try {
        const res = await getStores(); // ดึงร้านทั้งหมด
        const allStores = res.data || [];

        const favStores = allStores.filter(s =>
          favIds.includes(s.store_id)
        );

        setFavoriteStores(favStores);
      } catch (err) {
        console.error("Load favorites error:", err);
      }
    }

    loadFavorites();
  }, [tab]); // โหลดใหม่ตอนสลับแท็บ


  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to leave your atelier profile?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2D4A43',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      background: '#fff',
      customClass: { title: 'swal-title-atelier' }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile(p => ({ ...p, avatar: ev.target.result }));
      localStorage.setItem("pf_avatar", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const confirmEdit = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      await updateUserById(storedUser.user_id, {
        ...(editModal.field === "name" && { nickname: editModal.value }),
        ...(editModal.field === "phone" && { phone: editModal.value }),
        ...(editModal.field === "email" && { email: editModal.value }),
      });
      setProfile(p => ({ ...p, [editModal.field]: editModal.value }));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile Updated",
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: "Please check your connection" });
    } finally {
      setEditModal({ open: false, field: "", label: "", value: "" });
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "pending";
  
    const s = status.toLowerCase();
  
    if (s.includes("confirm")) return "confirmed";
    if (s.includes("cancel")) return "canceled";
    if (s.includes("done") || s.includes("complete")) return "done";
  
    return "pending";
  };
  
  if (loading) {
    return (
      <div className="loader-container">
        <div className="atelier-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <div className="atelier-container">
        {/* Header Section */}
        <header className="profile-header-card">
          <div className="profile-main-grid">
            <div className="avatar-side">
              <div className="avatar-wrapper">
                <img src={profile.avatar} alt="Member Portrait" />
                <label className="avatar-edit-badge">
                  <FiEdit3 />
                  <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <button className="btn-logout-minimal" onClick={handleLogout}>
                <FiLogOut /> Sign Out
              </button>
            </div>

            <div className="info-side">
              <div className="member-tag">MEMBER PROFILE</div>
              <h1 className="profile-name">{profile.username || "Guest User"}</h1>

              <div className="profile-fields-grid">
                <div className="field-group" onClick={() => setEditModal({ open: true, field: "name", label: "Nickname", value: profile.name })}>
                  <label><FiUser /> Nickname</label>
                  <div className="field-value">{profile.name}</div>
                </div>
                <div className="field-group" onClick={() => setEditModal({ open: true, field: "phone", label: "Contact Number", value: profile.phone })}>
                  <label><FiPhone /> Contact</label>
                  <div className="field-value">{profile.phone}</div>
                </div>
                <div className="field-group full-width" onClick={() => setEditModal({ open: true, field: "email", label: "Email Address", value: profile.email })}>
                  <label><FiMail /> Email Address</label>
                  <div className="field-value">{profile.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="atelier-tabs">
          <button className={`tab-item ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>Reservations</button>
          <button className={`tab-item ${tab === "favorites" ? "active" : ""}`} onClick={() => setTab("favorites")}>Favorites</button>
          <button className={`tab-item ${tab === "owner" ? "active" : ""}`} onClick={() => setTab("owner")}>Business</button>
        </nav>

        {/* Content Area */}
        <main className="tab-content">
          {tab === "bookings" && (
            <div className="booking-list">
              {bookings.length > 0 ? bookings.map((b, i) => (
                <div className="reservation-card" key={i}>
                  <div className="res-details">
                    <span className="res-store">{b.store_name}</span>
                    <h4 className="res-service">{b.svc}</h4>
                    <div className="res-meta">
                      <span><FiCalendar /> {b.booking_date}</span>
                      <span><FiClock /> {b.booking_time} น.</span>
                    </div>
                  </div>
                  <div className="res-status">
                    <span className={`status-badge ${getStatusClass(b.status_booking_name)}`}>
                      {b.status_booking_name || "Pending"}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <p>No upcoming reservations found.</p>
                </div>
              )}
            </div>
          )}

          {tab === "owner" && (
            <div className="business-ct">
              {hasStore ? (
                <>
                  <h3>Your Business Dashboard</h3>
                  <p>Manage your atelier and bookings from your dashboard.</p>
                  <button
                    className="btn-atelier-primary"
                    onClick={() => navigate(`/StoreDashboard/${storeData.store_id}`)}
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <h3>Become a Partner</h3>
                  <p>Showcase your atelier and reach more clients in our community.</p>
                  <button
                    className="btn-atelier-primary"
                    onClick={() => navigate("/AddStore")}
                  >
                    Register Your Business
                  </button>
                </>
              )}
            </div>
          )}


          {tab === "favorites" && (
            <div className="favorites-grid">
              {favoriteStores.length > 0 ? (
                favoriteStores.map((s) => (
                  <div className="fav-card" key={s.store_id}>
                    <img
                      src={`http://127.0.0.1:5010/static/images/${s.image}`}
                      alt={s.store_name}
                    />
                    <div className="fav-info">
                      <h4>{s.store_name}</h4>
                      <span>฿{Number(s.price).toLocaleString()}</span>
                      <button onClick={() => navigate(`/store2/${s.store_id}`)}>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No favorites yet. Start curating your atelier ✨</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="atelier-modal-overlay" onClick={() => setEditModal({ open: false })}>
          <div className="atelier-modal" onClick={e => e.stopPropagation()}>
            <h3>Update {editModal.label}</h3>
            <p className="modal-subtitle">Enter your new details below</p>
            <input
              autoFocus
              className="atelier-input"
              value={editModal.value}
              onChange={e => setEditModal({ ...editModal, value: e.target.value })}
            />
            <div className="modal-actions">
              <button className="btn-atelier-primary" onClick={confirmEdit}>Save Changes</button>
              <button className="btn-atelier-link" onClick={() => setEditModal({ open: false })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}