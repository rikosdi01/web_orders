import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "./OrderProcess.css";
import ActionButton from "../../../../../components/button/ActionButton/ActionButton";
import { Ban, Save } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import OrdersRepository from "../../../../../repository/OrdersRepository";
import { AuthContext } from "../../../../../context/AuthContext";
import BarcodeScannerUSB from "../../../../../services/BarcodeScannerUSB";
import ContentHeader from "../../../../../components/header/content_header/ContentHeader";
import { useToast } from "../../../../../context/ToastContext";

const OrderProcess = () => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const order = location.state?.order;
    const [scannedItems, setScannedItems] = useState(() => {
        return order?.content.map(item => ({ ...item, scannedQuantity: 0 })) || [];
    });

    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [scanError, setScanError] = useState("");

    useEffect(() => {
        const allItemsMatched = scannedItems.every(item => item.scannedQuantity === item.quantity);
        setIsSaveDisabled(!allItemsMatched);
    }, [scannedItems]);

    if (!order) {
        return <div>Order tidak tersedia</div>;
    }

    // ✅ Fungsi untuk menangani hasil scan
    const handleScan = (code) => {
        const cleanedCode = code.trim(); // Hapus spasi sebelum & sesudah
        console.log("Scanned Code:", cleanedCode); // Debugging

        const foundItem = scannedItems.find(item => item.item.trim() === cleanedCode);
        if (foundItem) {
            setScannedItems((prevItems) =>
                prevItems.map((item) =>
                    item.item.trim() === cleanedCode
                        ? { ...item, scannedQuantity: item.scannedQuantity + 1 }
                        : item
                )
            );
            setScanError("");
        } else {
            setScanError(`Item "${cleanedCode}" tidak ditemukan dalam orderan!`);
        }
    };


    const handleCancelProccess = async (id) => {
        try {
            const updatedOrder = {
                status: "Menunggu",
                processBy: null,
                processAt: null,
                updatedAt: Timestamp.now(),
            };

            await OrdersRepository.updateOrder(id, updatedOrder);
            showToast("berhasil", "Orderan berhasil dibatalkan!")
            navigate(`/order/${id}`);
        } catch (error) {
            console.error("Error processing order:", error);
            showToast("berhasil", "Orderan gagal dibatalkan!")
        }
    };

    const handleFinishOrder = async (id) => {
        if (!currentUser) {
            console.error("User not logged in");
            return;
        }

        try {
            const updatedOrder = {
                status: "Selesai",
                finishBy: currentUser.email, // Perbaikan typo dari `proccessBy`
                finishAt: Timestamp.now(),  // Perbaikan typo dari `proccessAt`
                updatedAt: Timestamp.now(),
            };

            await OrdersRepository.updateOrder(id, updatedOrder);
            showToast("berhasil", "Orderan telah diselesaikan!")
            navigate(`/order/${id}`);
        } catch (error) {
            console.error("Error processing order:", error);
            showToast("berhasil", "Orderan gagal diselesaikan!")
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <ContentHeader title="Proses Pesanan" />
            <div className="order-process-header">
                <h2>No. Orderan: {order.noOrder}</h2>
                <div className="order-process-action">
                    <ActionButton
                        background="red"
                        color="white"
                        icon={<Ban size={18} />}
                        title="Batal"
                        onclick={() => handleCancelProccess(order.id)}
                    />
                    <ActionButton
                        background="rgb(65, 225, 65)"
                        color="white"
                        icon={<Save size={18} />}
                        title="Simpan"
                        disabled={isSaveDisabled}
                        onclick={() => handleFinishOrder(order.id)}
                    />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Quantity Fisik</th>
                    </tr>
                </thead>
                <tbody>
                    {scannedItems.map((item, index) => {
                        let rowClass = "";
                        if (item.scannedQuantity > item.quantity) {
                            rowClass = "over-scanned";
                        } else if (item.scannedQuantity === item.quantity) {
                            rowClass = "matched-scanned";
                        }

                        return (
                            <tr key={index} className={rowClass}>
                                <td>{item.item}</td>
                                <td>{item.quantity}</td>
                                <td>{item.scannedQuantity}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {scanError && <p style={{ color: "red", fontWeight: "bold" }}>{scanError}</p>}

            <BarcodeScannerUSB onScan={handleScan} />
        </div>
    );
};

export default OrderProcess;