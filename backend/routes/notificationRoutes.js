const express = require("express");
const { sendNotification } = require("../controllers/notificationController");

const router = express.Router();

// Endpoint untuk mengirim notifikasi
router.post("/send-notification", sendNotification);

module.exports = router;