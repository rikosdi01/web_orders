import { Plus } from 'lucide-react';
import Search from '../../../components/search/Search';
import './Chat.css'
import ChatItem from './components/ChatItem/ChatItem';
import { useChats } from '../../../context/ChatsContext';
import Formatting from '../../../utils/format/Formatting';
import { useEffect, useState } from 'react';
import NewChat from './components/modal/newchat/NewChat';
import ChatContent from './components/chatcontent/ChatContent';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../../context/MessageContext';

const Chat = () => {
    const { chats } = useChats();
    const { latestMessages, getMessages } = useMessages();
    const navigate = useNavigate();

    const [openNewChat, setOpenNewChat] = useState(false);
    const toggleOpenModal = () => {
        setOpenNewChat(!openNewChat);
    }

    useEffect(() => {
        chats.forEach(chat => {
            console.log(chat);
            if (!latestMessages[chat.id]) {
                getMessages(chat.id); // Pastikan fetch pesan terbaru saat komponen pertama kali dimuat
            }
        });
    }, [chats]);
    

    return (
        <div className='chat-container'>
            <div className='chat-list-sidebar'>
                <div className='chat-list-header'>
                    {/* Header */}
                    <div className='chat-header'>
                        <div className='chat-title'>Chat</div>
                        <div className='add-chat' onClick={toggleOpenModal}>
                            <Plus size={16} />
                            Chat
                        </div>
                    </div>

                    {/* Search */}
                    <Search placeholder="Cari" customWidth='100%' />
                </div>

                {/* List Chat */}
                <div className='chat-list-container'>
                    {chats.map((chat) => {
                        const latestMessage = latestMessages?.[chat.id];

                        return (
                            <div className='chat-list-item' key={chat.id}>
                                <ChatItem
                                    name={chat.displayName}
                                    time={latestMessage ? Formatting.formatTime(latestMessage.createdAt) : "—"}
                                    message={latestMessage?.text || "Belum ada pesan"}
                                    onclick={() => navigate(`/chat/${chat.id}`)}
                                />
                            </div>
                        );
                    })}
                </div>

            </div>

            <ChatContent />

            {/* Modal Konfirmasi Hapus */}
            {openNewChat && (<NewChat onClose={() => setOpenNewChat(false)} />
            )}
        </div >
    )
}

export default Chat;