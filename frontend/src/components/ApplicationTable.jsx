function ApplicationTable({
  applications,
  onEdit,
  onDelete,
  onViewHistory,
}) {
  return (
    <div className="table-wrapper">
      <table className="applications-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Application ID</th>

            <th className="actions-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application, index) => (
            <tr
              key={
                application?.id ??
                `application-${index}`
              }
            >
              <td>
                <div className="company-cell">
                  <div className="company-logo">
                    {String(
                      application?.company ?? "?"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {application.company}
                    </strong>

                    <span>Company</span>
                  </div>
                </div>
              </td>

              <td>
                <div className="role-cell">
                  {application.role}
                </div>
              </td>

              <td>
                <span
                  className={`status-pill status-${String(
                    application?.status ?? "Applied"
                  ).toLowerCase()}`}
                >
                  <span className="status-dot"></span>

                  {application.status}
                </span>
              </td>

              <td>
                <span className="id-badge">
                  {application?.id
                    ? `#${application.id}`
                    : "N/A"}
                </span>
              </td>

              <td>
                <div className="row-actions">

                  <button
                    className="history-action"
                    onClick={() =>
                      onViewHistory(application)
                    }
                  >
                    History
                  </button>

                  <button
                    className="edit-action"
                    onClick={() =>
                      onEdit(application)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-action"
                    onClick={() =>
                      onDelete(application.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;