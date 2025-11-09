// Register.jsx
import React, { useState } from "react"; // Hapus useEffect
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import DokuInIcon from "../assets/DokuIn_Icon.svg"; // Tambahkan DokuInIcon
import DokuInLogo from "../assets/DokuIn_Logo.svg";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPengguna: "",
    email: "",
    kataSandi: "",
    kataSandi2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Hapus semua code useEffect

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.kataSandi !== formData.kataSandi2) {
      setMessage("Password dan Re-Confirm Password tidak cocok");
      return;
    }
    try {
      const newUser = {
        namaPengguna: formData.namaPengguna,
        email: formData.email,
        kataSandi: formData.kataSandi,
      };
      await axios.post("/api/auth/register", newUser);
      setShowPopup(true);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Registrasi gagal. Coba lagi.");
    }
  };

  return (
    // CONTAINER LUAR: Bertindak sebagai wrapper halaman penuh
    <div style={{
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
        
        {/* Konten Kiri (Logo) - Perlu diubah agar sama dengan Login.jsx */}
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
            <Link to="/login" style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center",
              textDecoration: "none"
            }}>Log In</Link>
            <div style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "white",
              color: "#2563EB",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              textAlign: "center"
            }}>Register</div>
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "24px"
          }}>Register Account</h2>
          {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username</label>
            <input
              type="text"
              name="namaPengguna"
              value={formData.namaPengguna}
              onChange={onChange}
              placeholder="username"
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
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
          <div style={{ marginBottom: "16px" }}>
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
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="kataSandi2"
                value={formData.kataSandi2}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              cursor: "pointer"
            }}
          >Sign up</button>
        </div>
      </div>

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "48px 40px",
            textAlign: "center",
            maxWidth: "420px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>Register Account</h2>
            <p style={{ fontSize: "16px", color: "#666", marginBottom: "32px" }}>Your Account has been registered</p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 48px",
                backgroundColor: "#000",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Eye, EyeOff } from "lucide-react";
// // UBAH: Import DokuInIcon dan DokuInLogo agar sama dengan Login.jsx
// import DokuInIcon from "../assets/DokuIn_Icon.svg";
// import DokuInLogo from "../assets/DokuIn_Logo.svg";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     namaPengguna: "",
//     email: "",
//     kataSandi: "",
//     kataSandi2: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showPopup, setShowPopup] = useState(false);

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.kataSandi !== formData.kataSandi2) {
//       setMessage("Password dan Re-Confirm Password tidak cocok");
//       return;
//     }
//     try {
//       const newUser = {
//         namaPengguna: formData.namaPengguna,
//         email: formData.email,
//         kataSandi: formData.kataSandi,
//       };
//       await axios.post("/api/auth/register", newUser);
//       setShowPopup(true);
//     } catch (err) {
//       setMessage(err.response?.data?.msg || "Registrasi gagal. Coba lagi.");
//     }
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       backgroundColor: "#f5f5f5",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       // UBAH: Samakan padding dengan Login.jsx
//       padding: "40px 60px"
//     }}>
//       <div style={{
//         width: "100%",
//         // UBAH: Samakan max-width dan gap dengan Login.jsx
//         maxWidth: "1600px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: "200px"
//       }}>
//         {/* UBAH: Ganti bagian logo agar sama persis dengan Login.jsx */}
//         <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//           <img src={DokuInIcon} alt="DokuIn Icon" style={{width: "80px", height: "80px"}} />
//           <img src={DokuInLogo} alt="DokuIn" style={{height: "60px"}} />
//         </div>

//         <div style={{
//           backgroundColor: "white",
//           borderRadius: "24px",
//           // UBAH: Samakan padding dan min-width dengan Login.jsx
//           padding: "40px 50px",
//           boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
//           minWidth: "450px"
//           // HAPUS: maxWidth: "420px" agar konsisten
//         }}>
//           <div style={{
//             backgroundColor: "#2563EB",
//             borderRadius: "12px",
//             padding: "6px",
//             display: "flex",
//             marginBottom: "32px"
//           }}>
//             <Link to="/login" style={{
//               flex: 1,
//               padding: "12px",
//               backgroundColor: "transparent",
//               color: "white",
//               borderRadius: "8px",
//               fontWeight: "600",
//               fontSize: "15px",
//               textAlign: "center",
//               textDecoration: "none"
//             }}>Log In</Link>
//             <div style={{
//               flex: 1,
//               padding: "12px",
//               backgroundColor: "white",
//               color: "#2563EB",
//               borderRadius: "8px",
//               fontWeight: "600",
//               fontSize: "15px",
//               textAlign: "center"
//             }}>Register</div>
//           </div>

//           <h2 style={{
//             fontSize: "28px",
//             fontWeight: "bold",
//             textAlign: "center",
//             marginBottom: "24px"
//           }}>Register Account</h2>

//           {message && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{message}</div>}

//           {/* Form fields - Biarkan seperti ini karena sudah benar untuk register */}
//           <div style={{ marginBottom: "16px" }}>
//             <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Username</label>
//             <input
//               type="text"
//               name="namaPengguna"
//               value={formData.namaPengguna}
//               onChange={onChange}
//               placeholder="username"
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

//           <div style={{ marginBottom: "16px" }}>
//             <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
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

//           <div style={{ marginBottom: "16px" }}>
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

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>Confirm Password</label>
//             <div style={{ position: "relative" }}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="kataSandi2"
//                 value={formData.kataSandi2}
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
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
//               cursor: "pointer"
//             }}
//           >Sign up</button>
//         </div>
//       </div>

//       {/* Popup fungsionalitas - Biarkan seperti ini */}
//       {showPopup && (
//         <div style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0,0,0,0.5)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: "white",
//             borderRadius: "24px",
//             padding: "48px 40px",
//             textAlign: "center",
//             maxWidth: "420px",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
//           }}>
//             <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>Register Account</h2>
//             <p style={{ fontSize: "16px", color: "#666", marginBottom: "32px" }}>Your Account has been registered</p>
//             <button
//               onClick={() => navigate("/login")}
//               style={{
//                 padding: "16px 48px",
//                 backgroundColor: "#000",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 cursor: "pointer"
//               }}
//             >Continue</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Register;

// // frontend/src/pages/Register.jsx

// import React, { useState } from "react";
// import axios from "axios";
// // import { useNavigate } from 'react-router-dom'; // Kita akan gunakan ini nanti

// const Register = () => {
//   // const navigate = useNavigate(); // Untuk pindah halaman setelah register

//   // State untuk menyimpan data formulir
//   const [formData, setFormData] = useState({
//     namaPengguna: "",
//     email: "", // Diperlukan oleh backend model
//     kataSandi: "",
//     kataSandi2: "", // Untuk "Re-Confirm"
//   });

//   // State untuk pesan error atau sukses
//   const [message, setMessage] = useState("");

//   // Destructuring agar mudah digunakan di <input>
//   const { namaPengguna, email, kataSandi, kataSandi2 } = formData;

//   // Fungsi ini dipanggil setiap kali ada perubahan di input form
//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Fungsi ini dipanggil saat form di-submit (Button Done)
//   const onSubmit = async (e) => {
//     e.preventDefault(); // Mencegah halaman reload

//     // Skenario Eksepsional: Validasi sisi client
//     if (kataSandi !== kataSandi2) {
//       setMessage("Password dan Re-Confirm Password tidak cocok");
//       return;
//     }

//     // Skenario Utama 3: User mengisi informasi
//     try {
//       const newUser = {
//         namaPengguna,
//         email,
//         kataSandi,
//       };

//       // Skenario Utama 4 & 5: Sistem memvalidasi dan membuat akun
//       // Kita kirim request ke backend.
//       // Perhatikan path '/api/auth/register'
//       const res = await axios.post("/api/auth/register", newUser);

//       // Jika berhasil
//       setMessage(res.data.msg || "Registrasi berhasil!");

//       // Kosongkan form
//       setFormData({
//         namaPengguna: "",
//         email: "",
//         kataSandi: "",
//         kataSandi2: "",
//       });

//       // Nanti kita bisa arahkan ke halaman login
//       // setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       // Skenario Eksepsional: Jika sistem menampilkan pesan kesalahan
//       setMessage(err.response.data.msg || "Registrasi gagal. Coba lagi.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h1>
//         DokuIn - <span className="text-primary">Registrasi Akun</span>
//       </h1>
//       {message && <div className="alert-message">{message}</div>}

//       <form onSubmit={onSubmit}>
//         <div className="form-group">
//           <label htmlFor="namaPengguna">Nama User</label>
//           <input type="text" name="namaPengguna" value={namaPengguna} onChange={onChange} required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input type="email" name="email" value={email} onChange={onChange} required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="kataSandi">Password</label>
//           <input type="password" name="kataSandi" value={kataSandi} onChange={onChange} minLength="6" required />
//         </div>
//         <div className="form-group">
//           <label htmlFor="kataSandi2">Re-Confirm Password</label>
//           <input type="password" name="kataSandi2" value={kataSandi2} onChange={onChange} minLength="6" required />
//         </div>
//         <input type="submit" value="Register (Done)" className="btn btn-primary btn-block" />
//       </form>
//     </div>
//   );
// };

// export default Register;
