import { useOrders } from '../../../../context/OrdersContext';
import Formatting from '../../../../utils/format/Formatting';
import './TableOrder.css';

const TableOrder = () => {
    const { orders, isLoading } = useOrders();

    const handleOrderDetails = (id) => {
        window.open(`/order/${id}`, "_blank");
      }

    return (
        <table>
            <thead>
                <tr>
                    <th>No. Orderan</th>
                    <th>Customer</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                            Sedang memuat...
                        </td>
                    </tr>
                ) : orders.length > 0 ? (
                    orders.map((order) => {
                        const { icon, color } = Formatting.formatStatus(order.status);
                        return (
                            <tr key={order.id} onClick={() => handleOrderDetails(order.id)}>
                                <td>{order.noOrder}</td>
                                <td>{order.customer}</td>
                                <td>{Formatting.formatDate(order.createdAt)}</td>
                                <td style={{ color, display: 'flex', fontWeight: '500', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {icon} {order.status}
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                            Tidak ada orderan
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableOrder;
