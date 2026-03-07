import { useEffect, useState } from 'react';
import { campaignsApi, accountsApi } from '../lib/api';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  account: { email: string; profileName?: string };
  _count: { leads: number };
  createdAt: string;
}

interface Account {
  id: string;
  email: string;
  profileName?: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'connection', accountId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([campaignsApi.list(), accountsApi.list()])
      .then(([campaignsRes, accountsRes]) => {
        setCampaigns(campaignsRes.data);
        setAccounts(accountsRes.data);
        if (accountsRes.data.length > 0) {
          setFormData((f) => ({ ...f, accountId: accountsRes.data[0].id }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await campaignsApi.create(formData);
      setCampaigns([data, ...campaigns]);
      setFormData({ name: '', type: 'connection', accountId: accounts[0]?.id || '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const { data } = await campaignsApi.toggle(id);
      setCampaigns(campaigns.map((c) => c.id === id ? { ...c, status: data.status } : c));
    } catch (error) {
      console.error('Failed to toggle campaign:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await campaignsApi.delete(id);
      setCampaigns(campaigns.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-linkedin-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Button onClick={() => setShowForm(!showForm)} disabled={accounts.length === 0}>
          {showForm ? 'Cancel' : '+ New Campaign'}
        </Button>
      </div>

      {accounts.length === 0 && (
        <Card className="mb-6">
          <CardContent>
            <p className="text-gray-500 text-center py-4">
              Please add a LinkedIn account first before creating campaigns.
            </p>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Create New Campaign</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Campaign Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
                >
                  <option value="connection">Connection Requests</option>
                  <option value="message">Direct Messages</option>
                  <option value="engagement">Post Engagement</option>
                  <option value="content">Content Publishing</option>
                </select>
              </div>
              <div>
<label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Account</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.profileName || account.email}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" loading={saving}>Create Campaign</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No campaigns yet. Create your first campaign to get started.
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{campaign.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {campaign.account?.profileName || campaign.account?.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign._count?.leads || 0}</td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex px-2 py-1 text-xs font-semibold rounded-full ' +
                        (campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                         campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')
                      }>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(campaign.id)}>
                        {campaign.status === 'active' ? 'Pause' : 'Start'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(campaign.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
