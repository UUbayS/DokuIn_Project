// frontend/src/components/StatsCard.jsx

import "./statsCard.css"

const StatsCard = ({title, value, colorClass }) => {
  const cardClasses = `stat-item ${colorClass}`;

  return (
    <div className="stats-grid">
      <div className={cardClasses}>
        <div className="stat-number">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>   
  );
};

export default StatsCard;