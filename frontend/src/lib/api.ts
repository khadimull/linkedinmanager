const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export const api = {
  // Auth
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

  // Accounts
  getAccounts: () => fetchAPI('/api/accounts'),
  
  getAccount: (id: string) => fetchAPI(`/api/accounts/${id}`),
  
  createAccount: (data: { linkedinEmail: string; linkedinPassword: string; name?: string }) =>
    fetchAPI('/api/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateAccount: (id: string, data: { name?: string; isActive?: boolean }) =>
    fetchAPI(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  deleteAccount: (id: string) =>
    fetchAPI(`/api/accounts/${id}`, { method: 'DELETE' }),

  // Campaigns
  getCampaigns: (accountId?: string) =>
    fetchAPI(`/api/campaigns${accountId ? `?accountId=${accountId}` : ''}`),
    
  getCampaign: (id: string) => fetchAPI(`/api/campaigns/${id}`),
  
  createCampaign: (data: {
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
    
  updateCampaign: (id: string, data: { name?: string; status?: string; settings?: object }) =>
    fetchAPI(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  deleteCampaign: (id: string) =>
    fetchAPI(`/api/campaigns/${id}`, { method: 'DELETE' }),

  // Leads
  getLeads: (params?: { accountId?: string; status?: string; tags?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.append('accountId', params.accountId);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tags) searchParams.append('tags', params.tags);
    const query = searchParams.toString();
    return fetchAPI(`/api/leads${query ? `?${query}` : ''}`);
  },
  
  getLead: (id: string) => fetchAPI(`/api/leads/${id}`),
  
  createLead: (data: {
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
    
  updateLead: (id: string, data: { status?: string; notes?: string; tags?: string[] }) =>
    fetchAPI(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  deleteLead: (id: string) =>
    fetchAPI(`/api/leads/${id}`, { method: 'DELETE' }),

  // AI
  generateContent: (data: { prompt: string; type: string; provider?: string }) =>
    fetchAPI('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  improveContent: (data: { content: string; instruction: string; provider?: string }) =>
    fetchAPI('/api/ai/improve', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
