import { useEffect, useState } from "react";

const BarcodeScannerUSB = ({ onScan }) => {
    useEffect(() => {
        let tempBarcode = "";

        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                const cleanBarcode = tempBarcode.replace(/Shift/g, "").trim(); // Hapus Shift & spasi
                if (onScan) onScan(cleanBarcode); // Kirim string bersih
                tempBarcode = ""; // Reset setelah scan selesai
            } else {
                tempBarcode += event.key;
            }
        };
        
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [onScan]);
};

export default BarcodeScannerUSB;
