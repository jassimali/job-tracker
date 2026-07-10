function ApplicationHistoryModal({
  application,
  history,
  loading,
  onClose,
}) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="history-modal">
        <div className="modal-header">
          <div>
            <p className="section-eyebrow">
              APPLICATION JOURNEY
            </p>

            <h2>
              Status History
            </h2>
          </div>

          <button
            className="close-modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="history-application-info">
          <div className="company-logo">
            {application.company
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {application.company}
            </strong>

            <span>
              {application.role}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="history-loading">
            <div className="spinner"></div>

            <p>Loading journey...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <h3>No history yet</h3>

            <p>
              Status changes will appear here.
            </p>
          </div>
        ) : (
          <div className="timeline">
            {history.map((item, index) => (
              <div
                className="timeline-item"
                key={item.id}
              >
                <div className="timeline-marker">
                  <div
                    className={`timeline-dot history-${item.status.toLowerCase()}`}
                  />

                  {index <
                    history.length - 1 && (
                    <div className="timeline-line" />
                  )}
                </div>

                <div className="timeline-content">
                  <strong>
                    {item.status}
                  </strong>

                  <span>
                    {new Date(
                      item.changed_at
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationHistoryModal;