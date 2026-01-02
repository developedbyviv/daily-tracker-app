export default function Card({ children, className = '', hover = false }) {
    return (
        <div className={`glass-card ${hover ? '' : 'no-hover'} ${className}`}>
            {children}
        </div>
    );
}
