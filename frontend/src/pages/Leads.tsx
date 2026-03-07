import { useEffect, useState } from 'react';
import { leadsApi } from '../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Lead {
  id: string;
  name: string;
  headline?: string;
  company?: string;
  location?: string;
  linkedinUrl: string;
  status: string;
  campaign?: { name: string };
  createdAt: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchLeads();
  }, [search, page]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await leadsApi.list({ search, page, limit });
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id: string) => {
    try {
      const { data } = await leadsApi.connect(id);
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: data.status } : l)));
    } catch (error) {
      console.error('Failed to send connection:', error);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    connected: 'bg-green-100 text-green-800',
    messaged: 'bg-purple-100 text-purple-800',
    replied: 'bg-teal-100 text-teal-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <span className="text-sm text-gray-500">{total} total leads</span>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by name, company, or headline..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-linkedin-500 mx-auto"></div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {search ? 'No leads found matching your search.' : 'No leads yet.'}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer"
                          className="font-medium text-linkedin-500 hover:underline">{lead.name}</a>
                        {lead.headline && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{lead.headline}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.company || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.campaign?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex px-2 py-1 text-xs font-semibold rounded-full ' +
                        (statusColors[lead.status] || 'bg-gray-100 text-gray-800')}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {lead.status === 'new' && (
                        <Button size="sm" onClick={() => handleConnect(lead.id)}>Connect</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
