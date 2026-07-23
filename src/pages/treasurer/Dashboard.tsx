// pages/treasurer/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wallet,
  AlertCircle,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarDays
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface TreasurerStats {
  totalDuesCollected: number;
  totalDuesCollectedAllTime: number;
  pendingAmount: number;
  activeEvents: number;
  overdueMembers: number;
  duesCollectedChange?: string;
  pendingAmountChange?: string;
  activeEventsChange?: string;
  overdueMembersChange?: string;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'event' | 'member';
  description: string;
  amount?: number;
  date: string;
  status?: 'success' | 'pending' | 'failed';
}

const TreasurerDashboard: React.FC = () => {
  const [stats, setStats] = useState<TreasurerStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantInfo, setTenantInfo] = useState<{ name: string; subdomain: string } | null>(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get tenant info from localStorage or context
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.get(`${API_URL}/api/treasurer/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentActivities(response.data.data.recentActivities || []);
        setTenantInfo(response.data.data.tenant);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
        setStats(getDefaultStats());
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
      
      setStats(getDefaultStats());
      setRecentActivities(getMockActivities());
    } finally {
      setLoading(false);
    }
  };

  // Default stats
  const getDefaultStats = (): TreasurerStats => ({
    totalDuesCollected: 0,
    totalDuesCollectedAllTime: 0,
    pendingAmount: 0,
    activeEvents: 0,
    overdueMembers: 0,
    duesCollectedChange: '+0%',
    pendingAmountChange: '+0%',
    activeEventsChange: '+0',
    overdueMembersChange: '+0',
  });

  // Mock activities
  const getMockActivities = (): RecentActivity[] => [
    {
      id: '1',
      type: 'payment',
      description: 'Payment received from John Doe',
      amount: 500,
      date: new Date().toISOString(),
      status: 'success',
    },
    {
      id: '2',
      type: 'event',
      description: 'New event created: Annual Fundraiser',
      date: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'member',
      description: 'Sarah Smith joined as member',
      date: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'payment',
      description: 'Pending payment from Mike Johnson',
      amount: 250,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
    },
  ];

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const configs = {
      success: {
        icon: CheckCircle,
        className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        label: 'Success',
      },
      pending: {
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500',
        label: 'Pending',
      },
      failed: {
        icon: XCircle,
        className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        label: 'Failed',
      },
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const safeStats = stats || getDefaultStats();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Treasurer Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tenantInfo?.name || 'Your Tenant'} • Manage dues, events, and members
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Dues Collected (This Month) */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-green-500 rounded-xl p-3">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {safeStats.duesCollectedChange || '+0%'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Dues Collected (This Month)
                  </span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {formatCurrency(safeStats.totalDuesCollected || 0)}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    All time: {formatCurrency(safeStats.totalDuesCollectedAllTime || 0)}
                  </p>
                </div>
              </div>

              {/* Total Pending Amount */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-yellow-500 rounded-xl p-3">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {safeStats.pendingAmountChange || '+0%'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Pending Amount
                  </span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {formatCurrency(safeStats.pendingAmount || 0)}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Needs attention
                  </p>
                </div>
              </div>

              {/* Active Events */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-500 rounded-xl p-3">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {safeStats.activeEventsChange || '+0'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Active Events
                  </span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {safeStats.activeEvents || 0}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Currently running
                  </p>
                </div>
              </div>

              {/* Overdue Members */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-red-500 rounded-xl p-3">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {safeStats.overdueMembersChange || '+0'}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Overdue Members
                  </span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {safeStats.overdueMembers || 0}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Need to follow up
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
              <Link
                to="/treasurer/events/create"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/15">
                    <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      Create Event
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Start a new fundraising event
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/treasurer/members"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-500/15">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      View Members
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage your members
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/treasurer/dues"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-3 dark:bg-green-500/15">
                    <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      Manage Dues
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track and collect dues
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Activities */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Activities
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest updates from your tenant
                  </p>
                </div>
              </div>

              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(activity.date)}
                            </span>
                            {activity.amount && (
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {formatCurrency(activity.amount)}
                              </span>
                            )}
                            {activity.status && getStatusBadge(activity.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TreasurerDashboard;