import { createContext, useContext, useEffect, useState } from 'react';
import OrdersRepository from '../repository/OrdersRepository';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const unsubscribe = OrdersRepository.getOrders((fetchedOrders) => {
            setOrders(fetchedOrders);
            setIsLoading(false); // Set loading false setelah data diambil
        });

        return () => unsubscribe();
    }, []);

    return (
        <OrderContext.Provider value={{ orders, isLoading }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);