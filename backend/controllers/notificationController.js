const admin = require("../firebase/firebaseAdmin");

const sendNotification = async (req, res) => {
    const { title, body, token, url } = req.body;

    if (!token) {
        return res.status(400).json({ error: "FCM Token is required!" });
    }

    // Log the incoming data for debugging purposes
    console.log("Sending notification with payload:", {
        title, body, token, url
    });

    const message = {
        data: { 
            title: title || "🔥 Notifikasi Baru!",
            body: body || "Ini adalah pesan default.",
            url: url || "http://localhost:5173/",  // URL must be passed in `data`
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Notifikasi berhasil dikirim:", response);
        res.status(200).json({ success: true, message: "Notifikasi berhasil dikirim", response });
    } catch (error) {
        console.error("Error mengirim notifikasi:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = { sendNotification };