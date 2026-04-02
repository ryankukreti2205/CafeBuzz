import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertCircle size={18} />,
    info: <Info size={18} />,
};

export default function Toast({ toasts, removeToast }) {
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => { setExiting(true); setTimeout(onClose, 350); }, toast.duration ?? 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`toast toast--${toast.type} ${exiting ? 'toast--exit' : ''}`}>
            <span className="toast-icon">{ICONS[toast.type] ?? ICONS.info}</span>
            <span className="toast-msg">{toast.message}</span>
            <button className="toast-close" onClick={() => { setExiting(true); setTimeout(onClose, 350); }}>
                <X size={14} />
            </button>
        </div>
    );
}
