const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (email: string, password: string, name: string) =>
    fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  getProfile: () => fetchAPI('/api/auth/profile'),
  
  updateProfile: (data: { name?: string; password?: string }) =>
    fetchAPI('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Accounts API
export const accountsApi = {
  list: () => fetchAPI('/api/accounts'),
  
  get: (id: string) => fetchAPI(`/api/accounts/${id}`),
  
  create: (data: { linkedinEmail: string; linkedinPassword: string; name?: string }) =>
    fetchAPI('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: { name?: string; isActive?: boolean }) =>
    fetchAPI(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) =>
    fetchAPI(`/api/accounts/${id}`, { method: 'DELETE' }),
};

// Campaigns API
export const campaignsApi = {
  list: (accountId?: string) =>
    fetchAPI(`/api/campaigns${accountId ? `?accountId=${accountId}` : ''}`),
    
  get: (id: string) => fetchAPI(`/api/campaigns/${id}`),
  
  create: (data: {
    name: string;
    type: string;
    accountId: string;
    settings?: object;
    scheduledAt?: string;
  }) =>
    fetchAPI('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: { name?: string; status?: string; settings?: object }) =>
    fetchAPI(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  toggle: (id: string, status: string) =>
    fetchAPI(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    
  delete: (id: string) =>
    fetchAPI(`/api/campaigns/${id}`, { method: 'DELETE' }),
};

// Leads API
export const leadsApi = {
  list: (params?: { accountId?: string; status?: string; tags?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.append('accountId', params.accountId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tags) searchParams.append('tags', params.tags);
    const query = searchParams.toString();
    return fetchAPI(`/api/leads${query ? `?${query}` : ''}`);
  },
  
  get: (id: string) => fetchAPI(`/api/leads/${id}`),
  
  create: (data: {
    linkedinUrl: string;
    accountId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    title?: string;
    tags?: string[];
  }) =>
    fetchAPI('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: { status?: string; notes?: string; tags?: string[] }) =>
    fetchAPI(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) =>
    fetchAPI(`/api/leads/${id}`, { method: 'DELETE' }),
  
  connect: (id: string) =>
    fetchAPI(`/api/leads/${id}/connect`, { method: 'POST' }),
};

// AI API
export const aiApi = {
  generate: (data: { prompt: string; type: string; provider?: string }) =>
    fetchAPI('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  improve: (data: { content: string; instruction: string; provider?: string }) =>
    fetchAPI('/api/ai/improve', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  ideas: (data: { topic: string; count?: number; provider?: string }) =>
    fetchAPI('/api/ai/ideas', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Default export for backward compatibility
export const api = {
  auth: authApi,
  accounts: accountsApi,
  campaigns: campaignsApi,
  leads: leadsApi,
  ai: aiApi,
};
