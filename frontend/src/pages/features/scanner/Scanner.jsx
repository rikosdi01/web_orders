import { useState } from "react";
import BarcodeScanner from "../../../services/BarcodeScanner";

const Scanner = () => {
    const [barcode, setBarcode] = useState("");

    return (
      <div>
        <BarcodeScanner onScan={(code) => setBarcode(code)} />
        {barcode && <p>Barcode Terdeteksi: {barcode}</p>}
      </div>
    );
  };

export default Scanner;