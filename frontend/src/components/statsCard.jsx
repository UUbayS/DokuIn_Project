// frontend/src/components/StatsCard.jsx

import "./statsCard.css"

const StatsCard = ({ title, value, colorClass }) => {
  const cardClasses = `stats-card ${colorClass}`;

  return (
    <div className={cardClasses}>
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
    </div>
  );
};

export default StatsCard;