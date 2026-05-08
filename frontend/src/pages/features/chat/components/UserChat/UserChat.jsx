import { CheckCheck } from 'lucide-react'
import './UserChat.css'
import { useState } from 'react'
import ImagesChatModal from '../../../../../components/modal/ImagesChatModal/ImagesChatModal';

const UserChat = ({
    image,
    messages,
    time,
    isActiveUser,
    isRead,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className='user-chat-container' style={{ justifyContent: isActiveUser ? 'end' : 'start' }}>
            <div className='user-chat'
                style={{
                    background: isActiveUser ? 'linear-gradient(to top right, #c7d2fe, #a5b4fc)' : 'white',
                    marginBottom: isActiveUser ? '5px' : '2px',
                    padding: image ? '0' : '0 10px'
                }}>

                {/* Messages */}
                <div className='chat-content-message' style={{ padding: image ? '0' : '8px 0' }}>
                    {image ? (
                        <img src={image} alt="Chat Image" className="chat-image" onClick={openModal}/>
                    ) : (
                        <span>{messages}</span>
                    )}
                </div>

                <div className='chat-content-read' style={{ position: image ? 'absolute' : 'static' }}>
                    <div className='chat-item-time' style={{ color: isActiveUser ? 'rgb(73, 73, 73)' : 'grey' }}>
                        {time}
                    </div>

                    {isActiveUser && (
                        <CheckCheck size={14} style={{ color: isRead ? "#0057D9" : 'rgb(73, 73, 73)' }} />
                    )}
                </div>
            </div>

            {isModalOpen && <ImagesChatModal closeModal={closeModal} image={image}/>}
        </div>
    )
}

export default UserChat;