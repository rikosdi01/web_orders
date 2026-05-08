import { useState } from "react";
import ImagePath from "../../../Utils/Constants/ImagePath";
import "./SignUp.css";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                <div className="signup-left">
                    <img src={ImagePath.logo} className="signup-image" alt="Logo" />
                    <div className="signup-image-title">Motorcycle Parts</div>
                </div>

                <div className="signup-right">
                    <div className="signup-title">Sign In</div>
                    <div className="signup-subtitle">Manajemen Stok</div>

                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="input-group">
                            <label>Email:</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Masukkan email anda"
                                    className="signup-input"
                                    style={{ padding: "0.75rem 1rem 0.75rem 2.8rem"}}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <label>Password:</label>
                            <div className="input-wrapper">
                                <LockKeyhole className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password anda"
                                    className="signup-input"
                                    style={{ padding: "0.75rem 2.8rem"}}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="toggle-password" onClick={togglePassword}>
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </span>
                            </div>
                        </div>

                        {/* Checkbox Remember Me */}
                        <div className="signup-remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Ingat Akun saya</label>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="signup-button">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;