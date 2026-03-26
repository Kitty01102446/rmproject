import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet"></link>
const logo = "/Logo/logoweb.png";

/* ===== helpers ===== */
function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function colorFromString(str = "user") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h},70%,45%)`;
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* ===== load user ===== */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        setUser(null);
        return;
      }
      const u = JSON.parse(raw);
      const profile = u.profile || u.avatar || u.photoURL || "";
      setUser({ ...u, profile });
      setAvatarOk(true);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const initials = useMemo(() => getInitials(user?.name), [user]);
  const seedColor = useMemo(
    () => colorFromString(user?.email || user?.name),
    [user]
  );

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner navbar-container">
        {/* logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="NailShop" className="logo-img" height={40} />
        </Link>

        {/* desktop menu */}
        <nav className="navbar-center">
          <Link to="/AllStores">ร้านทั้งหมด</Link>
          <Link to="/analyze">แนะนำสีเล็บ</Link>
          <Link to="/Articles">บทความดูแลเล็บ</Link>
          <Link to="/helpCenter">ติดต่อเรา</Link>
          <Link to="/aboutGlamNail">เกี่ยวกับเรา</Link>
        </nav>

        {/* right */}
        <div className="navbar-right">
          {/* login (desktop only – คุมด้วย CSS) */}
          {!user && (
            <Link to="/register" className="login-btn">
              เข้าสู่ระบบ
            </Link>
          )}

          {/* profile (clickable) */}
          {user && (
            <Link to="/UserProfile" className="profile-box profile-link">
              {user.profile && avatarOk ? (
                <img
                  src={user.profile}
                  className="profile-pic"
                  alt="profile"
                  onError={() => setAvatarOk(false)}
                />
              ) : (
                <div
                  className="profile-pic fallback"
                  style={{ background: seedColor }}
                >
                  {initials}
                </div>
              )}
              <span className="profile-name">{user.name}</span>
            </Link>
          )}

          {/* hamburger */}
          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ===== mobile menu ===== */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-nav">
          <Link to="/AllStores" onClick={() => setMenuOpen(false)}>
            ร้านทั้งหมด
          </Link>
          <Link to="/analyze" onClick={() => setMenuOpen(false)}>
            แนะนำสีเล็บ
          </Link>
          <Link to="/Articles" onClick={() => setMenuOpen(false)}>
            บทความดูแลเล็บ
          </Link>
          <Link to="/helpCenter" onClick={() => setMenuOpen(false)}>
            ติดต่อเรา
          </Link>
          <Link to="/aboutGlamNail" onClick={() => setMenuOpen(false)}>
            เกี่ยวกับเรา
          </Link>

          {user ? (
            <>
              <Link to="/UserProfile" onClick={() => setMenuOpen(false)}>
                โปรไฟล์ของฉัน
              </Link>
              <button className="mobile-logout" onClick={logout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
