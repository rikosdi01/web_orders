import { useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Settings = () => {
    const { dispatch } = useContext(AuthContext);  // Mengambil dispatch dari AuthContext
    const navigate = useNavigate();

    const handleLogOut = () => {
        // Dispatch action "LOGOUT" untuk memperbarui state currentUser ke null
        dispatch({ type: "LOGOUT" });

        // Menghapus cookie "user"
        Cookies.remove("user");

        // Navigasi ke halaman login atau halaman lain setelah logout
        navigate("/signin");  // Ganti dengan route yang sesuai
    }

    return (
        <div>
            <button type="button" onClick={handleLogOut}>Log Out</button>
        </div>
    );
}

export default Settings;