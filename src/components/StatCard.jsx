import Card from './Card';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
    return (
        <Card>
            <div className="stat-card">
                <div className="stat-card-content">
                    <div className="stat-card-header">
                        <span className="stat-card-title text-sm text-muted">{title}</span>
                        {Icon && (
                            <div className={`stat-card-icon stat-card-icon-${color}`}>
                                <Icon size={20} />
                            </div>
                        )}
                    </div>
                    <div className="stat-card-value">{value}</div>
                    {subtitle && (
                        <div className="stat-card-subtitle text-sm text-muted">{subtitle}</div>
                    )}
                </div>
            </div>
        </Card>
    );
}
