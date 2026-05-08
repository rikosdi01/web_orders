import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScan }) => {
  const [results, setResults] = useState([]);
  const scannerInstance = useRef(null);

  useEffect(() => {
    scannerInstance.current = new Html5Qrcode("reader");
    
    scannerInstance.current
      .start(
        { facingMode: "environment" },
        { fps: 10 },
        (decodedText) => {
          if (!results.includes(decodedText)) {
            setResults((prev) => [...prev, decodedText]);
            if (onScan) onScan(decodedText);
            alert(`Scan Berhasil: ${decodedText}`);
          }
        },
        (error) => console.warn("Scan Error:", error)
      )
      .catch((err) => {
        console.warn("Scanner start error:", err);
        alert("Scanner gagal dimulai: " + err);
      });

    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.stop().catch(console.warn);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px"}}>
      <div id="reader" style={{ width: "500px", height: "300px" }}></div>
    </div>
  );
  
};

// CSS in JS untuk styling modal fullscreen
const styles = {
  barcodeScan: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "linear-gradient(to top right, #c7d2fe, #a5b4fc)",
    color: "#3730a3",
    border: "none",
    borderRadius: "5px",
  },
};

export default BarcodeScanner;
