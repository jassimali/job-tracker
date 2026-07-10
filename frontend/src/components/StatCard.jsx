function StatCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">
        <p>{title}</p>

        <strong>{value}</strong>

        <span>{description}</span>
      </div>
    </article>
  );
}

export default StatCard;