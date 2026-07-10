import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationModal from "../components/ApplicationModal";
import Analytics from "./Analytics";
import ApplicationHistoryModal
  from "../components/ApplicationHistoryModal";

function Dashboard({

  currentUser,
  onLogout,
  activePage,
  onPageChange,
  applications,
  filteredApplications,
  loading,
  submitting,
  error,

  funnelAnalytics,
analyticsLoading,

  selectedApplication,
applicationHistory,
historyLoading,
onViewHistory,
onCloseHistory,

  searchTerm,
  statusFilter,

  showForm,
  editingId,
  company,
  role,
  status,

  onRefresh,
  onNewApplication,
  onSearchChange,
  onStatusFilterChange,

  onEdit,
  onDelete,

  onCompanyChange,
  onRoleChange,
  onStatusChange,
  onSubmit,
  onCloseForm,
}) {
  function countStatus(targetStatus) {
    return applications.filter(
      (application) =>
        application.status === targetStatus
    ).length;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
  activePage={activePage}
  onPageChange={onPageChange}
  currentUser={currentUser}
  onLogout={onLogout}
/>

      <main className="main-area">
        <Topbar
          loading={loading}
          onRefresh={onRefresh}
          onNewApplication={onNewApplication}
        />

        <div className="dashboard-content">
            <div className="dashboard-content">
  {activePage === "dashboard" && (
    <>
      <section className="welcome-section">
            <div>
              <p className="welcome-label">
                APPLICATION OVERVIEW
              </p>

              <h2>
                Keep your job search moving forward.
              </h2>

              <p className="welcome-description">
                Track opportunities, monitor progress,
                and manage every application from one
                organized workspace.
              </p>
            </div>
          </section>

          <section className="stats-grid">
            <StatCard
              icon="◎"
              title="Total Applications"
              value={applications.length}
              description="All opportunities"
              type="total"
            />

            <StatCard
              icon="↗"
              title="Applied"
              value={countStatus("Applied")}
              description="Awaiting response"
              type="applied"
            />

            <StatCard
              icon="◷"
              title="Interviews"
              value={countStatus("Interview")}
              description="Active conversations"
              type="interview"
            />

            <StatCard
              icon="✓"
              title="Selected"
              value={countStatus("Selected")}
              description="Successful outcomes"
              type="selected"
            />
          </section>

          {error && (
            <div className="error-banner">
              <span>!</span>

              <div>
                <strong>
                  Something went wrong
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          <section className="applications-section">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">
                  APPLICATION
                </p>

                <h2>Your Applications</h2>

                <p>
                  Manage and monitor all your
                  opportunities.
                </p>
              </div>

              <div className="application-count">
                {applications.length}
                <span>total</span>
              </div>
            </div>

            <div className="toolbar">
              <div className="search-wrapper">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search company or role..."
                  value={searchTerm}
                  onChange={(event) =>
                    onSearchChange(event.target.value)
                  }
                />
              </div>

              <select
                className="filter-select"
                value={statusFilter}
                onChange={(event) =>
                  onStatusFilterChange(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All statuses
                </option>

                <option value="Applied">
                  Applied
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Selected">
                  Selected
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>

                <p>
                  Loading your applications...
                </p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  ◫
                </div>

                <h3>
                  No applications found
                </h3>

                <p>
                  Add a new application or adjust
                  your filters.
                </p>

                <button
                  onClick={onNewApplication}
                >
                  + Add Application
                </button>
              </div>
            ) : (
              <ApplicationTable
                applications={filteredApplications}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewHistory={onViewHistory}
              />
            )}
          </section>
    </>
  )}


  {activePage === "analytics" && (
  <Analytics
    applications={applications}
  funnelAnalytics={funnelAnalytics}
  loading={analyticsLoading}
    
  />
)}
</div>
        </div>
      </main>

      {showForm && (
        <ApplicationModal
          editingId={editingId}
          company={company}
          role={role}
          status={status}
          submitting={submitting}
          onCompanyChange={onCompanyChange}
          onRoleChange={onRoleChange}
          onStatusChange={onStatusChange}
          onSubmit={onSubmit}
          onClose={onCloseForm}
        />
      )}

      {selectedApplication && (
  <ApplicationHistoryModal
    application={selectedApplication}
    history={applicationHistory}
    loading={historyLoading}
    onClose={onCloseHistory}
  />
)}
    </div>
  );
}

export default Dashboard;