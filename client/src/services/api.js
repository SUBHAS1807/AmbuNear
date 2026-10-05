/**
 * API Service Client for AmbuNear
 * Centralizes all network requests, JWT header attachment, and standardized response parsing.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ambunear_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred during request.');
      error.status = response.status;
      error.code = data.error || 'API_ERROR';
      error.errors = data.errors;
      throw error;
    }

    return data;
  } catch (error) {
    // If unauthorized and session expired, clear token
    if (error.status === 401 && !endpoint.includes('/login')) {
      localStorage.removeItem('ambunear_token');
      localStorage.removeItem('ambunear_user');
      window.dispatchEvent(new Event('auth-session-expired'));
    }
    throw error;
  }
};

export const api = {
  // Authentication
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
    updateProfile: (body) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  },

  // Ambulances
  ambulances: {
    getAll: (params = '') => request(`/ambulances${params}`),
    getNearby: (lat, lng, radiusKm = 25) =>
      request(`/ambulances/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${radiusKm}`),
    getById: (id) => request(`/ambulances/${id}`),
    create: (body) => request('/ambulances', { method: 'POST', body: JSON.stringify(body) }),
    updateStatus: (id, status) =>
      request(`/ambulances/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Bookings
  bookings: {
    create: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
    getAll: (params = '') => request(`/bookings${params}`),
    getById: (id) => request(`/bookings/${id}`),
    cancel: (id, cancellationReason) =>
      request(`/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ cancellationReason }),
      }),
    accept: (id) => request(`/bookings/${id}/accept`, { method: 'PATCH' }),
    reject: (id) => request(`/bookings/${id}/reject`, { method: 'PATCH' }),
    updateStatus: (id, status) =>
      request(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Driver
  driver: {
    getDashboard: () => request('/driver/dashboard'),
    getBookings: () => request('/driver/bookings'),
    updateAvailability: (isAvailable) =>
      request('/driver/availability', {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable }),
      }),
    updateLocation: (coords) =>
      request('/driver/location', {
        method: 'PATCH',
        body: JSON.stringify(coords),
      }),
  },

  // Admin
  admin: {
    getMetrics: () => request('/admin/metrics'),
    getUsers: (params = '') => request(`/admin/users${params}`),
    updateUserStatus: (id, accountStatus) =>
      request(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ accountStatus }),
      }),
    getDrivers: (params = '') => request(`/admin/drivers${params}`),
    verifyDriver: (id, status) =>
      request(`/admin/drivers/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    getAmbulances: () => request('/admin/ambulances'),
    verifyAmbulance: (id, status) =>
      request(`/admin/ambulances/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    getBookings: (params = '') => request(`/admin/bookings${params}`),
    getAuditLogs: () => request('/admin/audit-logs'),
  },

  // System
  health: () => request('/health'),
};
