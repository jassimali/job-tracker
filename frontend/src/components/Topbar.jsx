function Topbar({
  loading,
  onRefresh,
  onNewApplication,
}) {
  return (
    <header className="topbar">
      <div>
        <span className="page-label">
          WORKSPACE
        </span>

        <h1>Dashboard</h1>
      </div>

      <div className="topbar-actions">
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
        >
          <span>
            {loading ? "..." : "↻"}
          </span>

          {loading
            ? "Refreshing"
            : "Refresh"}
        </button>

        <button
          className="add-btn"
          onClick={onNewApplication}
        >
          <span>+</span>

          New Application
        </button>
      </div>
    </header>
  );
}

export default Topbar;