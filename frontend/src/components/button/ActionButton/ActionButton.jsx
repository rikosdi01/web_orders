import { PenOff } from 'lucide-react';
import './ActionButton.css'

const ActionButton = ({
    title,
    icon,
    onclick,
    background,
    color,
    disabled
}) => {
    return (
        <button
            type="button"
            onClick={onclick}
            className="action-button"
            style={{
                background: disabled ? "gray" : background, 
                color: disabled ? "white" : color,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1
            }}
            disabled={disabled}
        >
            <span>{disabled ? <PenOff /> : icon}</span>
            {title}
        </button>
    );
};

export default ActionButton