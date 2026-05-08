import { createContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: Cookies.get("user") ? {
        ...JSON.parse(Cookies.get("user")),
        refreshToken: Cookies.get("refreshToken") || null,
        accessToken: sessionStorage.getItem("accessToken") || null // Tambahkan ini
    } : null,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    // ✅ Fungsi untuk merefresh token
    const refreshAccessToken = async () => {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) return;

        try {
            const response = await fetch("https://securetoken.googleapis.com/v1/token?key=API_KEY", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                }),
            });

            const data = await response.json();
            if (data.access_token) {
                sessionStorage.setItem("accessToken", data.access_token);
                dispatch({
                    type: "UPDATE_ACCESS_TOKEN",
                    payload: data.access_token
                });
            }
        } catch (error) {
            console.error("Gagal memperbarui token:", error);
            dispatch({ type: "LOGOUT" });
        }
    };

    // ✅ Coba refresh token saat pertama kali halaman dimuat
    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")) {
            refreshAccessToken();
        }
    }, []);

    // ✅ Simpan user & refreshToken ke cookie
    useEffect(() => {
        if (state.currentUser) {
            Cookies.set("user", JSON.stringify({
                uid: state.currentUser.uid,
                email: state.currentUser.email
            }), { sameSite: 'Lax', secure: false });

            sessionStorage.setItem("accessToken", state.currentUser.accessToken);

            // Simpan refreshToken di cookie agar tetap ada setelah refresh
            Cookies.set("refreshToken", state.currentUser.refreshToken, {
                sameSite: 'Lax',
                secure: false, // Ubah ke false untuk testing di localhost
                expires: 7
            });


        } else {
            Cookies.remove("user");
            Cookies.remove("refreshToken");
            sessionStorage.removeItem("accessToken");
        }
    }, [state.currentUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (state.currentUser?.accessToken) {
                refreshAccessToken();
            }
        }, 10 * 60 * 1000); // 10 menit

        return () => clearInterval(interval);
    }, [state.currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
