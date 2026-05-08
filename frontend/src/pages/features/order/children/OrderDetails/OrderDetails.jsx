import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrdersRepository from "../../../../../repository/OrdersRepository";
import Formatting from "../../../../../utils/format/Formatting";
import './OrderDetails.css';
import ActionButton from "../../../../../components/button/ActionButton/ActionButton";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import { AuthContext } from "../../../../../context/AuthContext";
import { Timestamp } from "firebase/firestore";
import ContentHeader from "../../../../../components/header/content_header/ContentHeader";
import { useToast } from "../../../../../context/ToastContext";

const OrderDetails = () => {
    const { currentUser } = useContext(AuthContext);
    const { showToast } = useToast();

    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const fetchedOrder = await OrdersRepository.getOrderById(id);
            setOrder(fetchedOrder);
            setStatus(fetchedOrder.status);
        } catch (error) {
            console.error("Gagal mengambil data order ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcessOrder = async () => {
        if (!currentUser) {
            console.error("User not logged in");
            return;
        }

        try {
            const updatedOrder = {
                status: "Diproses",
                processBy: currentUser.email, // Perbaikan typo dari `proccessBy`
                processAt: Timestamp.now(),  // Perbaikan typo dari `proccessAt`
                updatedAt: Timestamp.now(),
            };

            await OrdersRepository.updateOrder(id, updatedOrder);
            showToast("berhasil", "Orderan berhasil diproses!")
            navigate(`/order/${id}/process`, { state: { order } });
        } catch (error) {
            console.error("Error processing order:", error);
            showToast("gagal", "Orderan gagal diproses!")
        }
    };

    const { icon, color } = order ? Formatting.formatStatus(order.status) : { icon: null, color: null };


    return (
        <div style={{ padding: '20px' }}>
            {isLoading ? (
                <p className="loading-text">Sedang memuat...</p>
            ) : order ? (
                <div className="order-card">
                    <ContentHeader title="Rincian Orderan" />
                    <div className="order-info">
                        <div>
                            <div className="order-info-section">Customer: <span>{order.customer}</span></div>
                            <div className="order-info-section">CSO: <span>{order.cso}</span></div>
                            <div className="order-info-section">No. Orderan: <span>{order.noOrder}</span></div>
                            <div className="order-info-section" style={{ display: "flex", gap: "5px" }}> Status:<span style={{ color, display: "flex", alignItems: "center", gap: "5px" }}>{icon} {order.status}</span>
                            </div>
                        </div>
                        {/* <div>
                            <div className="order-info-section" >
                                {"Tanggal dibuat: "}
                                <span>
                                    {order.createdAt
                                        ? Formatting.formatDate(order.createdAt)
                                        : "Belum tercatat"}
                                </span>
                            </div>
                            <div className="order-info-section" >
                                {"Tanggal diupdate: "}
                                <span>
                                    {order.updatedAt
                                        ? Formatting.formatDate(order.updatedAt)
                                        : "Belum tercatat"}
                                </span>
                            </div>
                            <div className="order-info-section" >
                                {"Tanggal diproses: "}
                                <span>
                                    {order.processAt
                                        ? Formatting.formatDate(order.processAt)
                                        : "Belum tercatat"}
                                </span>
                            </div>
                            <div className="order-info-section" >
                                {"Tanggal diselesaikan: "}
                                <span>
                                    {order.finishAt
                                        ? Formatting.formatDate(order.finishAt)
                                        : "Belum tercatat"}
                                </span>
                            </div>

                        </div> */}
                    </div>

                    <h3>Daftar Produk</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Produk</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.content.map((item, index) => (
                                <tr key={index} style={{ cursor: "default" }}>
                                    <td>{item.item}</td>
                                    <td>Rp {item.price.toLocaleString()}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rp {(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="order-details-action">
                        <ActionButton
                            background="red"
                            color="white"
                            icon={<Trash2 size={18} />}
                            title="Hapus"
                        />

                        <div className="order-details-action2">
                            <ActionButton
                                background="rgb(255, 179, 0)"
                                color="white"
                                icon={<Edit size={18} />}
                                title="Perbarui"
                            />
                            <ActionButton
                                icon={<RefreshCw size={18} />}
                                title={status === 'Menunggu' ? "Proses" : status === "Diproses" ? "Sedang diproses..." : "Selesai"}
                                onclick={handleProcessOrder}
                                disabled={status !== 'Menunggu'}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="error-text">Order tidak ditemukan</p>
            )}
        </div>
    );
};

export default OrderDetails;
