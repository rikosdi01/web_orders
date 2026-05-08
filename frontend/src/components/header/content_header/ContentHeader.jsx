import { useNavigate } from 'react-router-dom';
import './ContentHeader.css'
import { ArrowLeft } from 'lucide-react';

const ContentHeader = ({ title }) => {
    // const navigate = useNavigate();

    // const handleBackPage = () => {
    //     navigate('/orders ');
    // };

    return (
        <div className='content-header'>
            {/* <button className="back-page" onClick={handleBackPage}>
                <span><ArrowLeft size={20} /></span>
                Kembali
            </button> */}
            <div className='content-title'>{title}</div>
        </div>
    )
}

export default ContentHeader;