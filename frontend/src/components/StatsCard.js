import { Card } from 'react-bootstrap';

function StatsCard({ label, value, accent, helper }) {
    return (
        <Card className={`stat-card stat-card-${accent || 'blue'}`}>
            <Card.Body>
                <span className="stat-label">{label}</span>
                <strong className="stat-value">{value}</strong>
                {helper && <span className="stat-helper">{helper}</span>}
            </Card.Body>
        </Card>
    );
}

export default StatsCard;
