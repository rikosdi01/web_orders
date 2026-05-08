import { CheckCircle, Clock, RefreshCw } from "lucide-react";

export default class Formatting {
    static formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ' ' +
            date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    static formatTime = (timestamp) => {
        if (!timestamp) return ''; // Jika null, kosongkan saja
        const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };
    

    static formatStatus = (status) => {
        switch (status) {
            case 'Menunggu':
                return { icon: <Clock size={18} />, color: '#6B7280' }; // Abu-abu
            case 'Diproses':
                return { icon: <RefreshCw size={18} />, color: '#EAB308' }; // Kuning
            case 'Selesai':
                return { icon: <CheckCircle size={18} />, color: '#22C55E' }; // Hijau
            default:
                return { icon: <Clock size={18} />, color: '#6B7280' }; // Default abu-abu
        }
    };

    static formatInitial = (name) => {
        const words = name.split(' ');
        const initials = words
            .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word
            .slice(0, 2) // Get the first two initials
            .join(''); // Join them together
        return initials;
    };
}