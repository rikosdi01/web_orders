import { createContext, useContext, useEffect, useRef, useState } from 'react';
import ChatRepository from '../repository/ChatRepository';
import { AuthContext } from './AuthContext';
import UserRepository from '../repository/UserRepository';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);
    const userCache = useRef({});

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = ChatRepository.getChats(async (fetchedChats) => {
            // Fetch user names for Private chat
            const chatsWithNames = await Promise.all(
                fetchedChats.map(async (chat) => {
                    if (chat.type === "Group") {
                        return { ...chat, displayName: chat.room }; // Gunakan roomName untuk grup
                    }

                    // Private Chat: Cari user lain dalam participants
                    const participantId = chat.participants.find(id => id !== currentUser.uid);

                    if (!participantId) return { ...chat, displayName: "Unknown" };

                    if (userCache.current[participantId]) {
                        return { ...chat, displayName: userCache.current[participantId] };
                    }
                    
                    const user = await UserRepository.getUserById(participantId);
                    userCache.current[participantId] = user ? user.name : "Unknown";

                    return { ...chat, displayName: userCache.current[participantId] };
                })
            );

            setChats(chatsWithNames);
            setIsLoading(false);
        }, currentUser.uid);

        return () => unsubscribe && unsubscribe();
    }, [currentUser]);

    return (
        <ChatContext.Provider value={{ chats, isLoading }}>
            {children}
        </ChatContext.Provider>
    );
};


export const useChats = () => useContext(ChatContext);
