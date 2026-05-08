import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect, useContext } from "react";
import "./OrderProcess.css";
import BarcodeScanner from "../../../../../services/BarcodeScanner";
import ActionButton from "../../../../../components/button/ActionButton/ActionButton";
import { Ban, Save } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import OrdersRepository from "../../../../../repository/OrdersRepository";
import { AuthContext } from "../../../../../context/AuthContext";

const OrderProcess = () => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });

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

    const handleScan = (code) => {
        const foundItem = scannedItems.find(item => item.item === code);
        if (foundItem) {
            setScannedItems((prevItems) =>
                prevItems.map((item) =>
                    item.item === code ? { ...item, scannedQuantity: item.scannedQuantity + 1 } : item
                )
            );
            setScanError("");
        } else {
            setScanError("Item tidak ditemukan dalam orderan!");
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

            navigate(`/order/${id}`);
        } catch (error) {
            console.error("Error processing order:", error);
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

            navigate(`/order/${id}`);
        } catch (error) {
            console.error("Error processing order:", error);
        }
    };

    return (
        <div>
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

            {isMobile ? <BarcodeScanner onScan={handleScan} /> : <div></div>}
        </div>
    );
};

export default OrderProcess;