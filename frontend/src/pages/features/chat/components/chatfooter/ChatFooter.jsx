import { Camera, Paperclip, SendHorizontal, Sticker } from 'lucide-react';
import './ChatFooter.css'
import { useState } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import ChatRepository from '../../../../../repository/ChatRepository';

const ChatFooter = ({
    currentUser,
    id,
}) => {
    const [message, setMessage] = useState('');

    const createNewMessage = async () => {
        try {
            const newMessage = {
                createdAt: serverTimestamp(),
                isread: false,
                senderId: currentUser.uid,
                text: message,
                type: "text",
            }

            await ChatRepository.createMessage(id, newMessage);
            setMessage('');
        } catch (error) {
            console.error('Terjadi kesalahan ', error);
        }
    }

    return (
        <div className='chat-content-footer'>
            <div className='chat-input-container'>
                <Sticker size={20} color='#888' />
                <input
                    type='text'
                    placeholder='Ketik pesan'
                    className='chat-input'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className='chat-input-attribute'>
                    <Paperclip size={20} color='#888' cursor="pointer" />
                    <Camera size={20} color='#888' cursor="pointer" />
                </div>
            </div>
            <div className='chat-send-text' onClick={createNewMessage}>
                <SendHorizontal size={20} />
            </div>
        </div>
    )
}

export default ChatFooter;