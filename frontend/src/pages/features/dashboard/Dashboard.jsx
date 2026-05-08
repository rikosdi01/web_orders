import { useOrders } from "../../../context/OrdersContext";
import { useMemo } from "react";
import {
    BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ComposedChart
} from "recharts";
import "./Dashboard.css"; // 🛠 Impor file CSS baru

const Dashboard = () => {
    const { orders = [], isLoading } = useOrders();
    console.log(orders);

    const orderStats = useMemo(() => {
        if (!Array.isArray(orders) || orders.length === 0) {
            return {
                statusData: [],
                salesData: [],
                itemData: [], // ✅ Tambahkan itemData agar tidak undefined
                customerSales: [],
                itemTotals: [],
                userContributions: [],
            };
        }
    
        const statusCount = {};
        const customerTotal = {};
        const itemTotals = {};
        const userContributions = {};
    
        // ✅ Tambahkan itemData untuk menyimpan jumlah item per order
        const itemData = orders.map(order => ({
            name: order.noOrder,
            items: order.content.reduce((sum, item) => sum + item.quantity, 0),
        }));
    
        const salesData = orders.map(order => ({
            name: order.noOrder,
            total: order.content.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
        }));
    
        orders.forEach(order => {
            // Hitung jumlah status order
            statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    
            // Hitung total harga per pelanggan
            customerTotal[order.customer] = (customerTotal[order.customer] || 0) +
                order.content.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    
            // Hitung total jumlah item yang dipesan
            order.content.forEach(item => {
                itemTotals[item.item] = (itemTotals[item.item] || 0) + item.quantity;
            });
    
            // Hitung kontribusi user
            if (order.createdBy) {
                userContributions[order.createdBy] = (userContributions[order.createdBy] || 0) + 1;
            }
            if (order.processBy) {
                userContributions[order.processBy] = (userContributions[order.processBy] || 0) + 1;
            }
            if (order.finishBy) {
                userContributions[order.finishBy] = (userContributions[order.finishBy] || 0) + 1;
            }
        });
    
        return {
            statusData: Object.keys(statusCount).map(status => ({ name: status, count: statusCount[status] })),
            salesData,
            customerSales: Object.keys(customerTotal).map(customer => ({ name: customer, total: customerTotal[customer] })),
            itemTotals: Object.keys(itemTotals).map(item => ({ name: item, total: itemTotals[item] })),
            userContributions: Object.keys(userContributions).map(user => ({ name: user, count: userContributions[user] })),
            itemData, // ✅ Simpan itemData
        };
    }, [orders]);
    

    return (
        <div className="dashboard-container">
            {isLoading ? (
                <p className="loading-text">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="loading-text">No orders available</p>
            ) : (
                <>
                    {/* Order Status (Pie Chart) */}
                    <div className="chart-card">
                        <h2 className="chart-title">Order Status</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={orderStats.statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>


                    {/* User Contributions (Bar Chart) */}
                    <div className="chart-card">
                        <h2 className="chart-title">User Contributions</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={orderStats.userContributions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table untuk Total Item Terjual */}
                    <div className="chart-card full-width">
                        <h2 className="chart-title">Total Items Sold</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Total Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderStats.itemTotals.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    {/* Items Per Order (Bar Chart) */}
                    <div className="chart-card">
                        <h2 className="chart-title">Items Per Order</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={orderStats.itemData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="items" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sales Over Time (Area Chart) */}
                    <div className="chart-card full-width">
                        <h2 className="chart-title">Sales Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={orderStats.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="total" stroke="#ff7300" fill="#ff7300" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Order Trends (Line Chart) */}
                    <div className="chart-card full-width">
                        <h2 className="chart-title">Order Trends</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={orderStats.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>


                    {/* Customer Sales Comparison (Radar Chart) */}
                    <div className="chart-card">
                        <h2 className="chart-title">Customer Sales Comparison</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={orderStats.customerSales}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis />
                                <Radar name="Sales" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Items vs. Total Price (Scatter Chart) */}
                    <div className="chart-card">
                        <h2 className="chart-title">Items vs. Total Price</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <ScatterChart>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="items" name="Items" />
                                <YAxis type="number" dataKey="total" name="Total Price" />
                                <Tooltip />
                                <Scatter
                                    name="Orders"
                                    data={(orderStats.itemData || []).map((d, i) => ({
                                        items: d?.items || 0,
                                        total: orderStats.salesData[i]?.total || 0
                                    }))}
                                    fill="#ff7300"
                                />

                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Composed Chart */}
                    <div className="chart-card full-width">
                        <h2 className="chart-title">Composed Sales & Orders</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={orderStats.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" barSize={20} fill="#413ea0" />
                                <Line type="monotone" dataKey="total" stroke="#ff7300" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                </>
            )}
        </div>
    );
};

export default Dashboard;
