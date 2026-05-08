// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// let text = ""; // Simpan teks global

// io.on("connection", (socket) => {
//   socket.emit("update-text", text);

//   socket.on("update-text", (newText) => {
//     text = newText;
//     socket.broadcast.emit("update-text", text);
//   });
// });

// server.listen(5000, () => console.log("Server running on port 5000"));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));