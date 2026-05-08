import { SearchIcon } from 'lucide-react';
import ChatItem from '../ChatItem/ChatItem';
import './ChatContent.css';
import UserChat from '../UserChat/UserChat';
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Formatting from '../../../../../utils/format/Formatting';
import { AuthContext } from '../../../../../context/AuthContext';
import ChatFooter from '../chatfooter/ChatFooter';
import { useMessages } from '../../../../../context/MessageContext';

const ChatContent = () => {
    const { id } = useParams();
    const { messages, getMessages, activeChat, loadingMessages } = useMessages();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (id && id !== activeChat && !loadingMessages) { // ✅ Cegah fetch berulang saat loading
            getMessages(id);
        }
    }, [id]);

    return (
        <div className='chat-content'>
            {id ? (
                <>
                    <div className='chat-content-header'>
                        <ChatItem name={'asdasd'} isMessage={false} />
                        <SearchIcon color='grey' size={20} />
                    </div>


                    <div className='chat-content-body'>
                        {messages[id]?.length > 0 ? ( // ✅ Ambil array berdasarkan id
                            messages[id].map((message) => (
                                <div key={message.id}>
                                    <UserChat
                                        messages={message.text}
                                        time={Formatting.formatTime(message.createdAt)}
                                        isRead={message.isread}
                                        isActiveUser={message.senderId === currentUser?.uid}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>Belum ada percakapan</p>
                        )}
                    </div>

                    <ChatFooter
                        currentUser={currentUser}
                        id={id}
                    />
                </>
            ) : (
                <p className='empty-chat'>Pilih chat untuk memulai percakapan</p>
            )}
        </div>
    )
}

export default ChatContent;