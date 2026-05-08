import { createContext, useContext, useState, useEffect } from "react";
import ChatRepository from "../repository/ChatRepository";

const MessageContext = createContext();

export const MessagesProvider = ({ children }) => {
    const [messages, setMessages] = useState({}); // Cache pesan tiap chat
    const [lastVisible, setLastVisible] = useState({}); // Posisi paginasi terakhir
    const [latestMessages, setLatestMessages] = useState({}); // Preview chat terakhir
    const [activeChat, setActiveChat] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // ✅ Ambil pesan dengan paginasi
    const getMessages = async (chatId, isLoadMore = false) => {
        if (loadingMessages) return; // Hindari request ganda
        setLoadingMessages(true);

        // ✅ Ambil pesan dari cache jika ada, biar tidak fetch ulang
        if (!isLoadMore && messages[chatId]?.length > 0) {
            setActiveChat(chatId);
            setLoadingMessages(false);
            return;
        }

        let lastDoc = isLoadMore ? lastVisible[chatId] : null;
        const { messages: newMessages, lastVisible: newLast } = await ChatRepository.getMessages(chatId, lastDoc);

        setMessages(prev => ({
            ...prev,
            [chatId]: isLoadMore ? [...(prev[chatId] || []), ...newMessages] : newMessages, // ✅ Append jika Load More
        }));

        setLastVisible(prev => ({
            ...prev,
            [chatId]: newLast,
        }));

        if (!isLoadMore && newMessages.length > 0) {
            setLatestMessages(prev => ({
                ...prev,
                [chatId]: newMessages[newMessages.length - 1],
            }));
        }

        setActiveChat(chatId);
        setLoadingMessages(false);
    };

    useEffect(() => {
        if (!activeChat) return;

        let unsubscribe = () => {};
        unsubscribe = ChatRepository.listenForNewMessages(activeChat, (newMessages) => {
            if (newMessages.length === 0) return;
        
            setMessages(prev => {
                const existingMessages = prev[activeChat] || [];
                const newMessageIds = new Set(existingMessages.map(m => m.id));
        
                const filteredMessages = newMessages
                    .filter(m => !newMessageIds.has(m.id))
                    .map(m => ({
                        ...m,
                        createdAt: m.createdAt?.toDate() || new Date() // ✅ Ubah timestamp Firestore ke Date
                    }));
        
                return {
                    ...prev,
                    [activeChat]: [...existingMessages, ...filteredMessages],
                };
            });
        
            setLatestMessages(prev => ({
                ...prev,
                [activeChat]: newMessages[newMessages.length - 1],
            }));
        });
        
        return () => unsubscribe();
    }, [activeChat]);

    return (
        <MessageContext.Provider value={{ messages, getMessages, latestMessages, activeChat, loadingMessages }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => useContext(MessageContext);
