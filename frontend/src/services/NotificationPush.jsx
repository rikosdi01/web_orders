import { useEffect, useState } from "react";
import { getToken, messaging, onMessage } from "../firebase";
import { useNavigate } from "react-router-dom";  // Untuk pengalihan halaman
import { useToast } from "../context/ToastContext";

const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();  // Hook untuk navigasi      
  const { showToast } = useToast();

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });
        setFcmToken(token);  // Jika perlu, bisa digunakan untuk tujuan lain
      } catch (err) {
        console.log("Error getting token:", err);
      }
    };

    const unsubscribe = onMessage(messaging, (payload) => {
      const url = payload.data ? payload.data.url : null;
      setNotification(payload.notification); // Menyimpan notifikasi untuk pengolahan
      // Menampilkan alert sederhana (atau bisa diganti dengan UI yang lebih baik)
      // alert(`New Notification: ${payload.notification.title} - ${payload.notification.body}`);

      showToast("peringatan", "Orderan kamu belum diselesaikan, selesaikan segera untuk menghidari statistik diri yang buruk!")
      // if (url) {
      //   // Menghapus bagian "http://localhost:5173" jika sudah ada di awal URL
      //   const cleanUrl = url.startsWith("http://localhost:5173") ? url.replace("http://localhost:5173", "") : url;

      //   // Arahkan pengguna ke halaman yang sesuai ketika notifikasi di klik
      //   navigate(cleanUrl);
      // }
    });

    requestPermission();

    return () => unsubscribe();  // Hapus listener saat komponen unmount
  }, [navigate]);

  return { fcmToken, notification };
};

export default useFirebaseMessaging;
