// const sendNotification = async (fcmToken) => {
//     try {
//         const response = await fetch("http://localhost:5000/api/notifications/send-notification", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 title: "Pesan Baru 🚀",
//                 body: "Ini adalah notifikasi dari React!",
//                 token: fcmToken,
//             }),
//         });

//         const data = await response.json();
//         console.log("Response dari server:", data);
//     } catch (error) {
//         console.error("Gagal mengirim notifikasi:", error);
//     }
// };

// // Panggil fungsi ini dengan FCM token user yang valid
// sendNotification("fRLgf2QI6MEgevEJgmPkeU:APA91bEDrsYVX3le2syM8VwXN5H4zArO3ZFS89ryLy04kRHX7W9HhJpUbnmehSaKuvZ8uhiWR-cNJz1Aql5RslrXSQ0oCM_YfCuaxXuAvIXbT1hNIxNvZw4");