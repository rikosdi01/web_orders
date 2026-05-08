import { createContext, useContext, useEffect, useState } from 'react';
import OrdersRepository from '../repository/OrdersRepository';
import UserRepository from '../repository/UserRepository';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const unsubscribe = UserRepository.getUsers((fethedUsers) => {
            setUsers(fethedUsers);
            setIsLoading(false); // Set loading false setelah data diambil
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ users, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => useContext(UserContext);