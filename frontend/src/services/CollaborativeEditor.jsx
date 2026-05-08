import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Sesuaikan dengan backend

export default function CollaborativeEditor() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("update-text", (newText) => {
      setText(newText);
    });

    return () => socket.off("update-text");
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("update-text", e.target.value);
  };

  return (
    <textarea value={text} onChange={handleChange} rows="10" cols="50" />
  );
}