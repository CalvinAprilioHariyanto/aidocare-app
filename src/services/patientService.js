const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://aidocare-backend-production.up.railway.app');

function getAuthToken() {
  return localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token');
}

export async function getPatientProfile() {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/patient/profile`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `Failed to fetch patient profile (${response.status})`);
  }
  return data.profile;
}

export async function updatePatientProfile(payload) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/patient/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || `Failed to update patient profile (${response.status})`);
  }
  return data.profile;
}
