function ApplicationModal({
  editingId,
  company,
  role,
  status,
  submitting,
  onCompanyChange,
  onRoleChange,
  onStatusChange,
  onSubmit,
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
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="section-eyebrow">
              {editingId === null
                ? "NEW OPPORTUNITY"
                : "EDIT OPPORTUNITY"}
            </p>

            <h2>
              {editingId === null
                ? "Add Application"
                : "Update Application"}
            </h2>
          </div>

          <button
            className="close-modal"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="company">
              Company name
            </label>

            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) =>
                onCompanyChange(event.target.value)
              }
              placeholder="e.g. Google"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Job position
            </label>

            <input
              id="role"
              type="text"
              value={role}
              onChange={(event) =>
                onRoleChange(event.target.value)
              }
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              Application status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value)
              }
            >
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

          <div className="modal-actions">
            <button
              className="modal-cancel"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="modal-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId === null
                  ? "Add Application"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationModal;