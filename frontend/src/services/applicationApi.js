const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


function getAuthHeaders() {
  const token =
    localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",

    Authorization: `Bearer ${token}`,
  };
}

export async function getApplications() {
  const response = await fetch(
    `${API_URL}/applications`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load applications"
    );
  }

  const data = await response.json();

  return data.applications;
}


export async function createApplication(
  application
) {
  const response = await fetch(
    `${API_URL}/applications`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify(application),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create application"
    );
  }

  return response.json();
}


export async function updateApplication(
  applicationId,
  application
) {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
    {
      method: "PUT",

      headers: getAuthHeaders(),

      body: JSON.stringify(application),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update application"
    );
  }

  return response.json();
}


export async function removeApplication(
  applicationId
) {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
  {
    method: "DELETE",
    headers: getAuthHeaders(),
  }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete application"
    );
  }

  return response.json();
}

export async function getFunnelAnalytics() {
  const response = await fetch(
    `${API_URL}/analytics/funnel`,
  {
    headers: getAuthHeaders(),
  }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load analytics"
    );
  }

  return response.json();
}

export async function getApplicationHistory(
  applicationId
) {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/history`,
  {
    headers: getAuthHeaders(),
  }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load application history"
    );
  }

  const data = await response.json();

  return data.history;
}