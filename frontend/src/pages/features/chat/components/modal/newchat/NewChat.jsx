import { ArrowLeft, UserPlus2, UsersIcon, X } from 'lucide-react';
import './NewChat.css';
import ChatItem from '../../ChatItem/ChatItem';
import { useContext, useState } from 'react';
import { useUsers } from '../../../../../../context/UserContext';
import { AuthContext } from '../../../../../../context/AuthContext';
import ChatRepository from '../../../../../../repository/ChatRepository';

const NewChat = ({ onClose }) => {
    const { users } = useUsers();
    const { currentUser } = useContext(AuthContext);

    const [openNewContact, setOpenNewContact] = useState(false);

    // Daftar teman dari user yang login
    const friendsList = users.find(user => user.id === currentUser.uid)?.friends || [];

    // Tambahkan currentUser ke dalam daftar friends
    const chatContacts = users.filter(user => friendsList.includes(user.id) || user.id === currentUser.uid);

    // Filter user yang belum menjadi teman
    const availableContacts = users.filter(user => user.id !== currentUser.uid && !friendsList.includes(user.id));

    const toggleNewContact = () => {
        setOpenNewContact(!openNewContact);
    };

    // Fungsi membuat Room Chat baru
    const handleCreateRoomChat = async (userId) => {
        console.log('di klik')
        try {
            const newRoomChat = {
                participants: [currentUser.uid, userId], // Masukkan UID yang login & UID yang diklik
                type: "Private",
                lastMessages: null,
            };

            await ChatRepository.createRoom(newRoomChat);
            
        } catch (error) {
            console.error('Terjadi kesalahan: ', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <X className='close-modal' onClick={onClose} />
                <div className='modal-chat-title'>Percakapan Baru</div>

                <div className='modal-chat-field' onClick={toggleNewContact}>
                    <span><UserPlus2 size={18} /></span> Tambah Kontak
                </div>
                <div className='modal-chat-field'>
                    <span><UsersIcon size={18} /></span> Grup Baru
                </div>
                <input placeholder='Cari...' />

                {/* Menampilkan daftar teman termasuk diri sendiri */}
                {chatContacts.map(user => (
                    <div key={user.id} className="contact-item" onClick={() => handleCreateRoomChat(user.id)} >
                        {/* Kirim user.id ke handleCreateRoomChat */}
                        <ChatItem name={user.name}/>
                    </div>
                ))}
            </div>

            {openNewContact && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <div className="back-button" onClick={() => setOpenNewContact(false)}>
                            <ArrowLeft size={18} /> Kembali
                        </div>
                        Kontak Baru
                        <input placeholder='Cari Kontak...' />

                        {availableContacts.map(user => (
                            <div key={user.id} className="contact-item">
                                <ChatItem name={user.name} />
                                <UserPlus2 className="add-icon" onClick={() => console.log(`Tambah ${user.name}`)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewChat;
