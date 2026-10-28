const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://aidocare-backend-production.up.railway.app');

function getAuthToken() {
  return localStorage.getItem('aido_token') || sessionStorage.getItem('aido_token');
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error(`Network error during request to ${path}:`, error);
    throw new Error('Unable to connect to the server. Please check your connection.', { cause: error });
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // empty response
  }

  if (!response.ok) {
    const message = data.error?.message || data.message || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

export async function listAppointments() {
  const data = await request('/api/appointments');
  return data.appointments || [];
}

export async function getAppointment(id) {
  const data = await request(`/api/appointments/${id}`);
  return data.appointment;
}

export async function bookAppointment(payload) {
  const data = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.appointment;
}

export async function updateAppointment(id, payload) {
  const data = await request(`/api/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.appointment;
}

export async function cancelAppointment(id) {
  return updateAppointment(id, { status: 'CANCELLED' });
}

export async function rescheduleAppointment(id, appointmentDate, startTime) {
  return updateAppointment(id, { appointmentDate, startTime });
}
