import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { GetLogin } from "./callapi/call_api_Register.jsx";
import { RegisterUser } from "./callapi/call_api_Register";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Register.css";



export default function Register() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setTimeout(() => AOS.refresh(), 100);
  };

  // ---------------- LOGIN ----------------
  const [loginForm, setLoginForm] = useState({
    id: "",
    pw: "",
    remember: false,
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.id || !loginForm.pw) {
      return Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    try {
      const res = await GetLogin(loginForm.id, loginForm.pw);

      localStorage.setItem("user", JSON.stringify(res.user));

      await Swal.fire({
        title: "Welcome Back",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/home2");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err,
      });
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5010/login_google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw data.message;
  
      // ✅ เก็บ user จาก backend
      localStorage.setItem("user", JSON.stringify(data.user));
  
      Swal.fire({
        title: "Login Success",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
  
      navigate("/home2");
  
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error,
      });
    }
  };
  
  const handleGoogleError = () => {
    Swal.fire({
      icon: "error",
      title: "Google Login Failed",
    });
  };

  // ---------------- REGISTER ----------------
  const [regForm, setRegForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
    accept: false,
  });

  const [regMessage, setRegMessage] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (regForm.password !== regForm.confirm) {
      return setRegMessage("รหัสผ่านไม่ตรงกัน");
    }

    const userData = {
      username: `${regForm.firstname} ${regForm.lastname}`,
      nickname: regForm.firstname,
      phone: regForm.phone,
      email: regForm.email,
      password: regForm.password,
      role_id: 1,
    };

    try {
      const response = await RegisterUser(userData);

      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Welcome to the family!",
          icon: "success",
        });
        switchTab("login");
      }
    } catch (error) {
      setRegMessage("Registration Error");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="ag-root register-page">
      <main className="container-1450 reg-main">
        <div className="reg-grid">

          {/* LEFT */}
          <div className="reg-image-side" data-aos="fade-right">
            <div className="editorial-img-box">
              <img
                src="https://i.pinimg.com/1200x/b8/0d/ea/b80dea9c706baf8c5783cccd24cd4fe6.jpg"
                alt="Fashion"
              />
              <div className="img-overlay">
                <p className="playfair-title">Crystal Shine</p>
                <span>Discover Your Perfect Nails</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="reg-form-side" data-aos="fade-left">
            <header className="reg-header">
              <span className="editorial-tag">Membership</span>
              <h1 className="playfair-title">MY ACCOUNT</h1>
            </header>

            {/* Tabs */}
            <div className="reg-tabs-luxury">
              <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => switchTab("login")}
              >
                SIGN IN
              </button>
              <button
                className={activeTab === "register" ? "active" : ""}
                onClick={() => switchTab("register")}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <div className="form-content-box">
              {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit} data-aos="fade-in">

                  <div className="reg-input-group">
                    <label>Email or Phone</label>
                    <input
                      type="text"
                      value={loginForm.id}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, id: e.target.value })
                      }
                    />
                  </div>

                  <div className="reg-input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={loginForm.pw}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, pw: e.target.value })
                      }
                    />
                  </div>

                  <button className="btn-black-thin full-btn" type="submit">
                    SIGN IN
                  </button>

                  {/* 🔥 GOOGLE LOGIN */}
                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                    />
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} data-aos="fade-in">

                  <div className="editorial-form-grid">
                    <div className="reg-input-group">
                      <label>Firstname</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          setRegForm({ ...regForm, firstname: e.target.value })
                        }
                      />
                    </div>

                    <div className="reg-input-group">
                      <label>Lastname</label>
                      <input
                        type="text"
                        onChange={(e) =>
                          setRegForm({ ...regForm, lastname: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="reg-input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      onChange={(e) =>
                        setRegForm({ ...regForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="reg-input-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setRegForm({ ...regForm, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="editorial-form-grid">
                    <div className="reg-input-group">
                      <label>Password</label>
                      <input
                        type="password"
                        onChange={(e) =>
                          setRegForm({ ...regForm, password: e.target.value })
                        }
                      />
                    </div>

                    <div className="reg-input-group">
                      <label>Confirm</label>
                      <input
                        type="password"
                        onChange={(e) =>
                          setRegForm({ ...regForm, confirm: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button className="btn-black-thin full-btn" type="submit">
                    REGISTER NOW
                  </button>

                  {regMessage && <p className="reg-error">{regMessage}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
