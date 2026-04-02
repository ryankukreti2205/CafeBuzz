import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Clock } from 'lucide-react';
import './TrackOrder.css';

const STAGES = ['Order Placed', 'Preparing', 'Ready', 'Completed'];

export default function TrackOrder() {
    const { state } = useLocation();
    const active = 1; // "Preparing" is the default initial stage

    return (
        <main className="track-page fade-in">
            <div className="track-card">
                <div className="track-success-icon">
                    <CheckCircle size={48} />
                </div>
                <h1 className="track-heading">Order Confirmed!</h1>
                {state?.orderId && (
                    <p className="track-id">Order ID: <strong>#{state.orderId.slice(-8).toUpperCase()}</strong></p>
                )}
                {state?.total && (
                    <p className="track-total">Total paid: <strong>₹{Number(state.total).toFixed(2)}</strong></p>
                )}

                {/* Timeline */}
                <div className="track-timeline">
                    {STAGES.map((stage, idx) => (
                        <div key={stage} className={`track-step ${idx <= active ? 'track-step--done' : ''} ${idx === active ? 'track-step--active' : ''}`}>
                            <div className="track-step-dot">
                                {idx < active ? <CheckCircle size={16} /> : idx === active ? <Clock size={16} /> : <span>{idx + 1}</span>}
                            </div>
                            <span className="track-step-label">{stage}</span>
                            {idx < STAGES.length - 1 && <ChevronRight size={16} className="track-arrow" />}
                        </div>
                    ))}
                </div>

                <p className="track-eta">
                    ⏱ Estimated wait time: <strong>10–15 minutes</strong>
                </p>

                <Link to="/dashboard" className="btn btn-primary back-btn">Back to Menu</Link>
            </div>
        </main>
    );
}
