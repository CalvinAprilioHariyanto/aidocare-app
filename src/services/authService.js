const API_URL = import.meta.env.VITE_API_URL || 'https://aidocare-backend-production.up.railway.app';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error) {
    console.error(`Network error during request to ${path}:`, error);
    throw new Error('Unable to connect to the server. Please try again.');
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // Some error responses may not contain a JSON body.
  }

  if (!response.ok) {
    const errorMessage = data.error?.message || data.message || `Request failed (${response.status}).`;
    console.error(`API Error [${response.status}] for ${path}:`, errorMessage);
    throw new Error(errorMessage);
  }

  return data;
}

export function normalizeUser(user) {
  return {
    ...user,
    role: user.role?.toLowerCase(),
  };
}

export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!data.token || !data.user) {
    throw new Error('The server returned an invalid login response.');
  }

  return { token: data.token, user: normalizeUser(data.user) };
}

export async function register(userData) {
  const { firstName, lastName, email, phone, phoneNumber, password, confirmPassword } = userData;
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || phone,
      password,
      confirmPassword: confirmPassword || password,
    }),
  });
}

export async function getCurrentUser(token) {
  const data = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!data.user) {
    throw new Error('The server returned an invalid user response.');
  }

  return normalizeUser(data.user);
}
