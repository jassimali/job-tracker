function Sidebar({
  activePage,
  onPageChange,
  currentUser,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          JT
        </div>

        <div>
          <h2>JobTracker</h2>
          <span>Career workspace</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${
            activePage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onPageChange("dashboard")
          }
        >
          <span className="nav-icon">
            ▦
          </span>

          Dashboard
        </button>


        <button
          className={`nav-item ${
            activePage === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onPageChange("analytics")
          }
        >
          <span className="nav-icon">
            ⌁
          </span>

          Analytics
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-tip">
          <span className="tip-icon">
            ✦
          </span>

          <div>
            <strong>
              Stay consistent
            </strong>

            <p>
              Keep your job applications
              updated regularly.
            </p>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
  <div className="user-avatar">
    {currentUser?.name
      ?.charAt(0)
      .toUpperCase()}
  </div>

  <div className="user-details">
    <strong>
      {currentUser?.name}
    </strong>

    <span>
      {currentUser?.email}
    </span>
  </div>

  <button
    className="logout-button"
    onClick={onLogout}
    title="Logout"
  >
    Logout
  </button>
</div>
    </aside>
  );
}

export default Sidebar;