import { useEffect, useMemo, useState } from "react";
import "./App.css";

import AuthPage from "./pages/AuthPage";

import Dashboard from "./pages/Dashboard";

import {
  loginUser,
  registerUser,
} from "./services/authApi";


import {
  getApplications,
  createApplication,
  updateApplication as updateApplicationApi,
  removeApplication,
  getApplicationHistory,
  getFunnelAnalytics,
} from "./services/applicationApi";

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(
      localStorage.getItem("current_user")
    )
  );

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  const [applications, setApplications] = useState([]);

  const [funnelAnalytics, setFunnelAnalytics] =
    useState(null);

  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState(null);

  const [
    applicationHistory,
    setApplicationHistory,
  ] = useState([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  if (token) {
    loadApplications();
  }
}, [token]);

  async function loadApplications() {
    setLoading(true);
    setError("");

    try {
      const data = await getApplications();

      setApplications(data);

      await loadFunnelAnalytics();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function addApplication(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const newApplication = {
      company,
      role,
      status,
    };

    try {
      await createApplication(newApplication);

      await loadApplications();

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);

      setError(
        "Could not create the application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(email, password) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "current_user",
        JSON.stringify(data.user)
      );

      setToken(data.access_token);
      setCurrentUser(data.user);

    } catch (err) {
      setAuthError(err.message);

    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister(
    name,
    email,
    password
  ) {
    setAuthLoading(true);
    setAuthError("");

    try {
      await registerUser({
        name,
        email,
        password,
      });

      await handleLogin(
        email,
        password
      );

    } catch (err) {
      setAuthError(err.message);

    } finally {
      setAuthLoading(false);
    }
  }

  async function updateApplication(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const updatedApplication = {
      company,
      role,
      status,
    };

    try {
      await updateApplicationApi(
        editingId,
        updatedApplication
      );

      resetForm();
      setShowForm(false);

      await loadApplications();
    } catch (err) {
      console.error(err);

      setError(
        "Could not update the application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteApplication(applicationId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await removeApplication(applicationId);

      setApplications((current) =>
        current.filter(
          (application) =>
            application.id !== applicationId
        )
      );

      if (editingId === applicationId) {
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Could not delete the application."
      );
    }
  }

  async function loadFunnelAnalytics() {
    setAnalyticsLoading(true);

    try {
      const data = await getFunnelAnalytics();

      setFunnelAnalytics(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not load analytics."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function openApplicationHistory(
    application
  ) {
    setSelectedApplication(application);
    setApplicationHistory([]);
    setHistoryLoading(true);

    try {
      const history =
        await getApplicationHistory(
          application.id
        );

      setApplicationHistory(history);
    } catch (err) {
      console.error(err);

      setError(
        "Could not load application history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  function startEdit(application) {
    setEditingId(application.id);

    setCompany(application.company);
    setRole(application.role);
    setStatus(application.status);

    setShowForm(true);
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");

    setToken(null);
    setCurrentUser(null);
    setApplications([]);
    setFunnelAnalytics(null);
  }

  function resetForm() {
    setEditingId(null);

    setCompany("");
    setRole("");
    setStatus("Applied");
  }

  function closeForm() {
    resetForm();
    setShowForm(false);
  }

  function openNewApplicationForm() {
    resetForm();
    setShowForm(true);
  }

  function closeApplicationHistory() {
    setSelectedApplication(null);
    setApplicationHistory([]);
  }


  const filteredApplications = useMemo(() => {
    const searchValue = searchTerm
      .trim()
      .toLowerCase();

    return applications.filter((application) => {
      const companyValue = String(
        application?.company ?? ""
      ).toLowerCase();

      const roleValue = String(
        application?.role ?? ""
      ).toLowerCase();

      const statusValue = String(
        application?.status ?? "Applied"
      );

      const matchesSearch =
        companyValue.includes(searchValue) ||
        roleValue.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        statusValue === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  return (
    <>
      {!token ? (
        <AuthPage
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
          error={authError}
        />
      ) : (

        <Dashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          activePage={activePage}
          onPageChange={setActivePage}
          applications={applications}
          filteredApplications={filteredApplications}
          loading={loading}
          submitting={submitting}
          error={error}

          funnelAnalytics={funnelAnalytics}
          analyticsLoading={analyticsLoading}

          selectedApplication={selectedApplication}
          applicationHistory={applicationHistory}
          historyLoading={historyLoading}

          onViewHistory={openApplicationHistory}
          onCloseHistory={closeApplicationHistory}

          searchTerm={searchTerm}
          statusFilter={statusFilter}

          showForm={showForm}
          editingId={editingId}
          company={company}
          role={role}
          status={status}

          onRefresh={loadApplications}
          onNewApplication={openNewApplicationForm}

          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}

          onEdit={startEdit}
          onDelete={deleteApplication}

          onCompanyChange={setCompany}
          onRoleChange={setRole}
          onStatusChange={setStatus}

          onSubmit={
            editingId === null
              ? addApplication
              : updateApplication
          }

          onCloseForm={closeForm}
        />
      )}
    </>
  );
}

export default App;