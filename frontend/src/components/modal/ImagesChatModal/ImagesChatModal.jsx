import { Bookmark, EllipsisVertical, Reply, Star, X } from 'lucide-react';
import './ImagesChatModal.css'
import { useState } from 'react';
import { Tooltip } from "react-tooltip";

const ImagesChatModal = ({
    closeModal,
    image
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showMore, setShowMore] = useState(false);

    const toggleHeader = () => {
        if (showMore) {
            setShowMore(!showMore);
        } else {
            setShowHeader(!showHeader);
        }
    }

    const toggleShowMore = () => {
        setShowMore(!showMore);
    }

    return (
        <div className='image-chat-modal-container' onClick={(e) => {
            if (e.target === e.currentTarget) {
                closeModal();
            }
        }}>
            {showHeader && (
                <div className='images-modal-header'>
                    <div className='images-modal-header-children'>
                        <X size={24} onClick={() => closeModal()} />
                        <div>
                            <div className='images-modal-title'>Junior SDI01</div>
                            <div className='images-modal-time'>22:40</div>
                        </div>
                    </div>
                    <div className='images-modal-icon'>
                        <Star size={24} fill={isFavorite ? "white" : "none"} onClick={() => setIsFavorite(!isFavorite)} data-tooltip-id="tooltip" data-tooltip-content="Favorit" />
                        <Bookmark size={24} fill={isFavorite ? "white" : "none"} onClick={() => setIsFavorite(!isFavorite)} data-tooltip-id="tooltip" data-tooltip-content="Simpan" />
                        <Reply size={24} data-tooltip-id="tooltip" data-tooltip-content="Balas" />
                        <EllipsisVertical size={24} onClick={toggleShowMore} data-tooltip-id="tooltip" data-tooltip-content="Lainnya" />

                        <Tooltip id="tooltip" place="bottom" />
                    </div>
                </div>
            )}

            <img src={image} alt="Chat Image" className="images-modal-image" onClick={toggleHeader} />

            {showMore && (
                <div className='images-modal-show-more'>
                    <div className='images-modal-attribute'>Edit</div>
                    <div className='images-modal-attribute'>Semua Media</div>
                    <div className='images-modal-attribute'>Tampilkan di chat</div>
                </div>
            )}
        </div>
    )
}

export default ImagesChatModal;