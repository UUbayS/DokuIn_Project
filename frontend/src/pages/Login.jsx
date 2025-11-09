// Login.jsx

import React, { useState } from "react"; // Hapus useEffect
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import DokuInIcon from "../assets/DokuIn_Icon.svg";
import DokuInLogo from "../assets/DokuIn_Logo.svg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPengguna: "",
    kataSandi: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Hapus semua code useEffect

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await login(formData.namaPengguna, formData.kataSandi);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
    }
  };

  return (
    // CONTAINER LUAR: Bertindak sebagai wrapper halaman penuh
    <div style={{
      // minHeight: "100vh", sekarang bekerja karena margin body sudah 0
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5", // Background abu-abu muda
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      // PADDING DITAMBAH DI SINI, memberi jarak dari tepi viewport
      padding: "40px 60px" 
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "200px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img src={DokuInIcon} alt="DokuIn Icon" style={{width: "80px", height: "80px"}} />
          <img src={DokuInLogo} alt="DokuIn" style={{height: "60px"}} />
        </div>

        <div style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "40px 50px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          minWidth: "450px"
        }}>
          {/* ... sisa form ... */}
          <div style={{
            backgroundColor: "#2563EB",
            borderRadius: "12px",
            padding: "6px",
            display: "flex",
            marginBottom: "32px"
          }}>
            <div style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "white",
              color: "#2563EB",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center"
            }}>Log In</div>
            <Link to="/register" style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center",
              textDecoration: "none"
            }}>Register</Link>
          </div>

          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px"
          }}>LOG IN</h2>

          {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username/Email</label>
            <input
              type="text"
              name="namaPengguna"
              value={formData.namaPengguna}
              onChange={onChange}
              placeholder="example@gmail.com"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="kataSandi"
                value={formData.kataSandi}
                onChange={onChange}
                placeholder="Password"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingRight: "48px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={onSubmit}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#000",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "12px"
            }}
          >Log In Karyawan</button>

          <button
            onClick={onSubmit}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "white",
              color: "#000",
              border: "2px solid #000",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >Log In Admin</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Eye, EyeOff } from "lucide-react";
// import DokuInIcon from "../assets/DokuIn_Icon.svg";
// import DokuInLogo from "../assets/DokuIn_Logo.svg";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     namaPengguna: "",
//     kataSandi: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     try {
//       await login(formData.namaPengguna, formData.kataSandi);
//       navigate("/dashboard");
//     } catch (err) {
//       setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
//     }
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       backgroundColor: "#f5f5f5",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "40px 60px"
//     }}>
//       <div style={{
//         width: "100%",
//         maxWidth: "1600px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: "200px"
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//           <img src={DokuInIcon} alt="DokuIn Icon" style={{width: "80px", height: "80px"}} />
//           <img src={DokuInLogo} alt="DokuIn" style={{height: "60px"}} />
//         </div>

//         <div style={{
//           backgroundColor: "white",
//           borderRadius: "24px",
//           padding: "40px 50px",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
//           minWidth: "450px"
//         }}>
//           <div style={{
//             backgroundColor: "#2563EB",
//             borderRadius: "12px",
//             padding: "6px",
//             display: "flex",
//             marginBottom: "32px"
//           }}>
//             <div style={{
//               flex: 1,
//               padding: "12px",
//               backgroundColor: "white",
//               color: "#2563EB",
//               borderRadius: "8px",
//               fontWeight: "600",
//               fontSize: "15px",
//               textAlign: "center"
//             }}>Log In</div>
//             <Link to="/register" style={{
//               flex: 1,
//               padding: "12px",
//               backgroundColor: "transparent",
//               color: "white",
//               borderRadius: "8px",
//               fontWeight: "600",
//               fontSize: "15px",
//               textAlign: "center",
//               textDecoration: "none"
//             }}>Register</Link>
//           </div>

//           <h2 style={{
//             fontSize: "28px",
//             fontWeight: "bold",
//             textAlign: "center",
//             marginBottom: "24px"
//           }}>LOG IN</h2>

//           {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}

//           <div style={{ marginBottom: "20px" }}>
//             <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username/Email</label>
//             <input
//               type="text"
//               name="namaPengguna"
//               value={formData.namaPengguna}
//               onChange={onChange}
//               placeholder="example@gmail.com"
//               style={{
//                 width: "100%",
//                 padding: "14px 16px",
//                 border: "2px solid #e5e7eb",
//                 borderRadius: "12px",
//                 fontSize: "15px",
//                 outline: "none",
//                 boxSizing: "border-box"
//               }}
//               required
//             />
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Password</label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="kataSandi"
//                 value={formData.kataSandi}
//                 onChange={onChange}
//                 placeholder="Password"
//                 style={{
//                   width: "100%",
//                   padding: "14px 16px",
//                   paddingRight: "48px",
//                   border: "2px solid #e5e7eb",
//                   borderRadius: "12px",
//                   fontSize: "15px",
//                   outline: "none",
//                   boxSizing: "border-box"
//                 }}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{
//                   position: "absolute",
//                   right: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   padding: "4px"
//                 }}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           <button
//             onClick={onSubmit}
//             style={{
//               width: "100%",
//               padding: "16px",
//               backgroundColor: "#000",
//               color: "white",
//               border: "none",
//               borderRadius: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               cursor: "pointer",
//               marginBottom: "12px"
//             }}
//           >Log In Karyawan</button>

//           <button
//             onClick={onSubmit}
//             style={{
//               width: "100%",
//               padding: "16px",
//               backgroundColor: "white",
//               color: "#000",
//               border: "2px solid #000",
//               borderRadius: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               cursor: "pointer"
//             }}
//           >Log In Admin</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// // frontend/src/pages/Login.jsx

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Import hook kita

// const Login = () => {
//   const { login } = useAuth(); // Gunakan fungsi login dari Context
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     namaPengguna: "",
//     kataSandi: "",
//   });
//   const [message, setMessage] = useState("");

//   const { namaPengguna, kataSandi } = formData;

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Skenario Utama (Use Case Scenario #2 [cite: 212])
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(""); // Bersihkan pesan error sebelumnya

//     try {
//       // 1. User memasukkan kredensial dan submit
//       // 2. Sistem mengecek (ini dilakukan oleh fungsi 'login' di context)
//       await login(namaPengguna, kataSandi);

//       // 3. Sistem memberikan akses & redirect
//       navigate("/dashboard"); // Arahkan ke dashboard jika sukses
//     } catch (err) {
//       // Skenario Eksepsional: Jika kredensial salah [cite: 212]
//       setMessage(err.message || "Login gagal. Periksa kembali data Anda.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h1>
//         DokuIn - <span className="text-primary">Login</span>
//       </h1>
//       {/* Tampilkan pesan error jika ada */}
//       {message && <div className="alert-message">{message}</div>}

//       {/* Formulir berdasarkan UI Design #2 [cite: 213, 233] */}
//       <form onSubmit={onSubmit}>
//         <div className="form-group">
//           <label htmlFor="namaPengguna">Nama User</label>
//           <input type="text" name="namaPengguna" value={namaPengguna} onChange={onChange} required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="kataSandi">Password</label>
//           <input type="password" name="kataSandi" value={kataSandi} onChange={onChange} required />
//         </div>
//         <input type="submit" value="Login (Done)" className="btn btn-primary btn-block" />
//       </form>
//       <p style={{ textAlign: "center", marginTop: "1rem" }}>
//         Belum punya akun? <Link to="/register">Registrasi di sini</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;
