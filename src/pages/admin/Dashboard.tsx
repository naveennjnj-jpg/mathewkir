// pages/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  DollarSign,
  CalendarDays,
  UserPlus,
  CreditCard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// 🔥 Updated Types according to Super Admin API
interface GlobalStats {
  totalTenants: number;
  activeTenants: number;
  pendingTenants: number;
  suspendedTenants: number;
  inactiveTenants: number;
  totalMembers: number;
  totalOpeningBalance: number;
  totalPaid: number;
  totalOutstanding: number;
  membersWithDues: number;
  fullyPaidMembers: number;
  overpaidMembers: number;
  totalEvents: number;
  totalContributions: number;
  pendingPayments: number;
  totalPayouts: number;
  totalPayoutAmount: number;
  totalBeneficiaries: number;
  collectionRate: number;
}

interface TenantStats {
  totalMembers: number;
  openingBalance: number;
  totalPaid: number;
  outstanding: number;
  membersWithDues: number;
  fullyPaidMembers: number;
  overpaidMembers: number;
  totalEvents: number;
  totalContributions: number;
  pendingPayments: number;
  totalPayouts: number;
  totalPayoutAmount: number;
  totalBeneficiaries: number;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  created_at: string;
  brand_color: string | null;
  logo_url: string | null;
  bank_account_ref: string | null;
  stats: TenantStats;
  recentActivities: Array<{
    id: string;
    action: string;
    entity_type: string;
    user: string;
    created_at: string;
    details: any;
  }>;
}

interface DashboardData {
  global: GlobalStats;
  tenants: Tenant[];
  topTenantsByOutstanding: Tenant[];
  recentActivities: Array<{
    id: string;
    action: string;
    entity_type: string;
    tenant: string;
    user: string;
    created_at: string;
    details: any;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📊 Admin Dashboard Response:', response.data);

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

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
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs: Record<string, any> = {
      active: {
        icon: CheckCircle,
        className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        label: 'Active',
      },
      pending: {
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500',
        label: 'Pending',
      },
      suspended: {
        icon: XCircle,
        className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        label: 'Suspended',
      },
      inactive: {
        icon: AlertCircle,
        className: 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400',
        label: 'Inactive',
      },
    };

    const config = configs[status.toLowerCase()] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Get activity icon
  const getActivityIcon = (action: string) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('member')) return <UserPlus className="w-4 h-4 text-purple-500" />;
    if (actionLower.includes('payment') || actionLower.includes('contribution')) return <CreditCard className="w-4 h-4 text-green-500" />;
    if (actionLower.includes('event')) return <CalendarDays className="w-4 h-4 text-blue-500" />;
    if (actionLower.includes('payout')) return <DollarSign className="w-4 h-4 text-orange-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
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

  const global = dashboardData?.global;
  const tenants = dashboardData?.tenants || [];
  const topTenants = dashboardData?.topTenantsByOutstanding || [];
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Super Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage all tenants, users, and financial data across the platform
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
                <Link
                  to="/admin/tenants"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Tenant
                </Link>
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

            {/* 🔥 Stats Cards - From Global Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {/* Total Tenants */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-500 rounded-xl p-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {global?.activeTenants || 0} Active
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {global?.totalTenants || 0}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {global?.pendingTenants || 0} Pending · {global?.suspendedTenants || 0} Suspended
                  </p>
                </div>
              </div>

              {/* Total Members */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-green-500 rounded-xl p-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {global?.membersWithDues || 0} Have Dues
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Members</span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {formatNumber(global?.totalMembers || 0)}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {global?.fullyPaidMembers || 0} Fully Paid
                  </p>
                </div>
              </div>

              {/* Total Outstanding */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-red-500 rounded-xl p-3">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {global?.collectionRate || 0}% Collected
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding</span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {formatCurrency(global?.totalOutstanding || 0)}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Paid: {formatCurrency(global?.totalPaid || 0)}
                  </p>
                </div>
              </div>

              {/* Total Events & Payouts */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="bg-purple-500 rounded-xl p-3">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {global?.totalPayouts || 0} Payouts
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Events</span>
                  <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                    {global?.totalEvents || 0}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Pending: {global?.pendingPayments || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔥 Top Tenants by Outstanding */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Top Tenants by Outstanding
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tenants with highest pending dues
                  </p>
                </div>
                <Link
                  to="/admin/tenants"
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  View All →
                </Link>
              </div>

              {topTenants.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No tenants found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {topTenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3">
                            <div>
                              <span className="font-medium text-gray-800 dark:text-white/90">{tenant.name}</span>
                              <p className="text-xs text-gray-400">{tenant.subdomain}</p>
                            </div>
                          </td>
                          <td className="py-3">{getStatusBadge(tenant.status)}</td>
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{tenant.stats.totalMembers}</td>
                          <td className="py-3 text-sm font-medium text-gray-800 dark:text-white/90">
                            {formatCurrency(tenant.stats.openingBalance)}
                          </td>
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(tenant.stats.totalPaid)}
                          </td>
                          <td className="py-3 text-sm font-medium text-red-600">
                            {formatCurrency(tenant.stats.outstanding)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 🔥 Recent Global Activities */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Global Activities
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest activities across all tenants
                  </p>
                </div>
                <Link
                  to="/admin/audit-logs"
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  View All →
                </Link>
              </div>

              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.slice(0, 10).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getActivityIcon(activity.action)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {activity.action?.replace(/_/g, ' ') || 'Activity'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(activity.created_at)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.tenant}
                            </span>
                            <span className="text-xs text-gray-400">by</span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                              {activity.user}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {activity.entity_type}
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

export default AdminDashboard;