import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountsApi, campaignsApi, leadsApi } from '../lib/api';
import { Card, CardContent } from '../components/Card';

interface Stats {
  accounts: number;
  campaigns: number;
  activeCampaigns: number;
  leads: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    accounts: 0,
    campaigns: 0,
    activeCampaigns: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accountsRes, campaignsRes, leadsRes] = await Promise.all([
          accountsApi.list(),
          campaignsApi.list(),
          leadsApi.list({ limit: 1 }),
        ]);

        setStats({
          accounts: accountsRes.data.length,
          campaigns: campaignsRes.data.length,
          activeCampaigns: campaignsRes.data.filter((c: any) => c.status === 'active').length,
          leads: leadsRes.data.total || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'LinkedIn Accounts', value: stats.accounts, icon: '👤', color: 'bg-blue-500', link: '/accounts' },
    { title: 'Total Campaigns', value: stats.campaigns, icon: '📢', color: 'bg-purple-500', link: '/campaigns' },
    { title: 'Active Campaigns', value: stats.activeCampaigns, icon: '🚀', color: 'bg-green-500', link: '/campaigns' },
    { title: 'Total Leads', value: stats.leads, icon: '🎯', color: 'bg-orange-500', link: '/leads' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-linkedin-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent>
                <div className="flex items-center">
                  <div className={card.color + ' w-12 h-12 rounded-lg flex items-center justify-center text-2xl'}>
                    {card.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/accounts" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">➕</span>
              <p className="mt-2 font-medium text-gray-900">Add Account</p>
              <p className="text-sm text-gray-500">Connect a LinkedIn account</p>
            </Link>
            <Link to="/campaigns" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📢</span>
              <p className="mt-2 font-medium text-gray-900">Create Campaign</p>
              <p className="text-sm text-gray-500">Start a new outreach campaign</p>
            </Link>
            <Link to="/ai" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🤖</span>
              <p className="mt-2 font-medium text-gray-900">Generate Content</p>
              <p className="text-sm text-gray-500">Create posts with AI</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
