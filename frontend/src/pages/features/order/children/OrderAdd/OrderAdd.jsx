import './OrderAdd.css';
import { Box, CalendarDays, DollarSign, FileDigit, Hash, ListPlus, Save, User, UserPen } from 'lucide-react';
import InputLabel from '../../../../../components/input/InputLabel/InputLabel.jsx';
import InputField from '../../../../../components/input/InputField/InputField.jsx';
import { useContext, useEffect, useState } from 'react';
import ActionButton from '../../../../../components/button/ActionButton/ActionButton.jsx';
import { AuthContext } from '../../../../../context/AuthContext.jsx';
import { Timestamp } from 'firebase/firestore';
import OrdersRepository from '../../../../../repository/OrdersRepository.jsx';
import ContentHeader from '../../../../../components/header/content_header/ContentHeader.jsx';
import { useToast } from '../../../../../context/ToastContext.jsx';

const OrderAdd = () => {
    const { currentUser } = useContext(AuthContext);
    const { showToast } = useToast();
    
    const [customer, setCustomer] = useState("");
    const [cso, setCso] = useState("");
    const [noOrder, setNoOrder] = useState("");
    const [date, setDate] = useState("");
    const [items, setItems] = useState([{ item: "", quantity: 0, price: 0 }]);

    const [loading, setLoading] = useState(true);

    const resetForm = () => {
        setCustomer('');
        setCso('');
        setNoOrder('');
        setDate(date);
        setItems([{ item: "", quantity: 0, price: 0 }]);
    }

    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Offset dalam milidetik
        const localDateTime = new Date(now - offset).toISOString().slice(0, 16);
        setDate(localDateTime);
    }, []);

    const handleInputChange = (index, field, value) => {
        setItems((prevItems) => {
            let newItems = [...prevItems];

            newItems[index] = {
                ...newItems[index],
                [field]: field === "quantity" || field === "price" ? parseFloat(value) || 0 : value
            };

            // Tambahkan row baru jika input terakhir tidak kosong
            if (index === newItems.length - 1 && (newItems[index].item.trim() !== "" || newItems[index].quantity !== 0)) {
                newItems.push({ item: "", quantity: 0, price: 0 });
            }

            return newItems;
        });
    };


    const handleResetItems = () => {
        setItems([{ item: "", quantity: 0, price: 0 }]);
    };

    const handleSaveOrder = async (e) => {
        e.preventDefault();

        try {
            const filteredItems = items.filter((item) => item.item.trim() !== "");

            const createdAtTimestamp = Timestamp.fromDate(new Date(date));

            const newOrder = {
                customer,
                cso,
                noOrder,
                content: filteredItems,
                status: 'Menunggu',
                createdBy: currentUser.email,
                createdAt: createdAtTimestamp,
                updatedAt: Timestamp.now(),
            }

            await OrdersRepository.createOrder(newOrder);
            showToast("berhasil", "Orderan berhasil ditambahkan!")
            resetForm();
        } catch (err) {
            console.error('Gagal menambahkan Orderan: ', err);
            showToast("gagal", "Orderan gagal ditambahkan!")
        } finally {
            setLoading(false);
        }
    }


    return (
        <div style={{ padding: '20px' }}>
            <ContentHeader title="Tambah Orderan"/>
            <form> {/* Form untuk membungkus semua input */}
                <div className='input-label-section'>
                    <div className='input-label-sub-section'>
                        <InputLabel
                            label="Customer"
                            icon={<User className="input-icon" />}
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                        />
                        <InputLabel
                            label="CSO"
                            icon={<UserPen className="input-icon" />}
                            value={cso}
                            onChange={(e) => setCso(e.target.value)}
                        />
                    </div>
                    <InputLabel
                        type="datetime-local"
                        label="Tanggal"
                        icon={<CalendarDays className="input-icon" />}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                </div>
                <div className='input-label-section'>
                    <InputLabel
                        label="No Orderan"
                        icon={<FileDigit className="input-icon" />}
                        value={noOrder}
                        onChange={(e) => setNoOrder(e.target.value)}
                    />
                </div>

                {/* Content */}
                <div className='content-item-header'>
                    <label className='input-text-label'>List Item:</label>
                    <div className='reset-item' onClick={handleResetItems}>Hapus semua</div>
                </div>
                <div className='order-add-content'>
                    {items.map((item, index) => (
                        <div className='content-item-quantity' key={index}>
                            <InputField
                                icon={<Box className="input-icon" />}
                                label="Item"
                                value={item.item}
                                onChange={(e) => handleInputChange(index, "item", e.target.value)}
                            />
                            <InputField
                                type='number'
                                icon={<Hash className="input-icon" />}
                                label="Quantity"
                                value={item.quantity === 0 ? "" : item.quantity}
                                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                            />
                            <InputField
                                type='number'
                                icon={<DollarSign className="input-icon" />}
                                label="Harga"
                                value={item.price === 0 ? "" : item.price}
                                onChange={(e) => handleInputChange(index, "price", e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <ActionButton icon={<ListPlus />} title="Simpan" onclick={handleSaveOrder} />
            </form>
        </div>
    );
};

export default OrderAdd;
