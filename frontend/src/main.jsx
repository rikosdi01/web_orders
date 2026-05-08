import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";

// Pastikan path ke service worker benar
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Jika ada service worker yang sudah terdaftar, unregister yang lama
    registration.unregister().then(() => {
      // Kemudian daftarkan service worker baru
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((err) => console.log("Service Worker registration failed:", err));
    });
  });
}

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
