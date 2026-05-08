import { CircleDashed } from 'lucide-react';
import './ChatItem.css'
import Formatting from '../../../../../utils/format/Formatting';

const  ChatItem = ({
    name,
    time,
    message,
    isMessage = true,
    isOnline = true,
    onclick,
}) => {
    return (
        <div className="chat-item" onClick={onclick}>
            <div className='chat-item-avatar'>
                {Formatting.formatInitial(name)}
            </div>
            <div className='chat-item-content'>
                <div className='chat-item-header'>
                    <div className='chat-item-name'>{name}</div>
                    <div className='chat-item-time'>{time}</div>
                </div>

                {isMessage
                    ? <div className='chat-item-message'>{message}</div>
                    : <div className='chat-item-status'>
                        {
                            isOnline
                                ? <div className='online-status'>
                                    <div className='online-dot'></div>
                                    <p>Online</p>
                                </div>
                                : <div className='away-status'><CircleDashed size={14} /> Terakhir di lihat 1 menit yang lalu</div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default ChatItem;