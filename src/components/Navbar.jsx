import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
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
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [avatarOk, setAvatarOk] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = useMemo(() => getInitials(user?.name), [user]);
  const seedColor = useMemo(
    () => colorFromString(user?.email || user?.name),
    [user]
  );

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner navbar-container">
        {/* logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="NailShop" className="navbar-logo-img" height={40} />
        </Link>

        {/* desktop menu */}
        <nav className="navbar-center">
          <Link to="/AllStores">{t("nav_all_stores")}</Link>
          <Link to="/analyze">{t("nav_analyze")}</Link>
          <Link to="/Articles">{t("nav_articles")}</Link>
          <Link to="/helpCenter">{t("nav_contact")}</Link>
          <Link to="/aboutGlamNail">{t("nav_about")}</Link>
        </nav>

        {/* right */}
        <div className="navbar-right">
          <div className="language-switch" role="group" aria-label="Language switcher">
            <button
              type="button"
              className={language === "th" ? "active" : ""}
              onClick={() => setLanguage("th")}
            >
              TH
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
          </div>

          {/* login (desktop only – คุมด้วย CSS) */}
          {!user && (
            <Link to="/register" className="login-btn">
              {t("nav_login")}
            </Link>
          )}

          {/* profile (clickable) */}
          {user && (
            <div className="profile-menu-wrap" ref={profileMenuRef}>
              <button
                type="button"
                className={`profile-box profile-trigger ${profileOpen ? "active" : ""}`}
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
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
                <span className="navbar-profile-name">{user.name || t("nav_profile")}</span>
                <span className={`profile-caret ${profileOpen ? "open" : ""}`} aria-hidden="true" />
              </button>

              {profileOpen && (
                <div className="profile-dropdown profile-dropdown-open" role="menu">
                  <Link to="/UserProfile" className="profile-dropdown-item" onClick={() => setProfileOpen(false)}>
                    {t("nav_profile")}
                  </Link>
                  <button type="button" className="profile-dropdown-item danger" onClick={logout}>
                    {t("nav_logout")}
                  </button>
                </div>
              )}
            </div>
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
          <div className="mobile-language-switch">
            <button type="button" className={language === "th" ? "active" : ""} onClick={() => setLanguage("th")}>TH</button>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <Link to="/AllStores" onClick={() => setMenuOpen(false)}>
            {t("nav_all_stores")}
          </Link>
          <Link to="/analyze" onClick={() => setMenuOpen(false)}>
            {t("nav_analyze")}
          </Link>
          <Link to="/Articles" onClick={() => setMenuOpen(false)}>
            {t("nav_articles")}
          </Link>
          <Link to="/helpCenter" onClick={() => setMenuOpen(false)}>
            {t("nav_contact")}
          </Link>
          <Link to="/aboutGlamNail" onClick={() => setMenuOpen(false)}>
            {t("nav_about")}
          </Link>

          {user ? (
            <>
              <Link to="/UserProfile" onClick={() => setMenuOpen(false)}>
                {t("nav_profile")}
              </Link>
              <button className="mobile-logout" onClick={logout}>
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              {t("nav_login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
