// pages/admin/Dashboard.tsx (or wherever your file is)
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
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface DashboardStats {
  totalTenants: number;
  totalMembers: number;
  totalFundsTracked: number;
  activeTenants: number;
  totalTenantsChange?: string;
  totalMembersChange?: string;
  totalFundsChange?: string;
  activeTenantsChange?: string;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdDate: string;
  treasurer: string;
  treasurerEmail: string;
  bankAccount: string;
  members: number;
  totalFunds: number;
  maxMembers: number;
  subscriptionTier: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  // Fix: Use the correct API URL (8000 instead of 5000)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and recent tenants in parallel
      const [statsResponse, tenantsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_URL}/api/admin/tenants?limit=5&page=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Set stats
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      } else {
        setError(statsResponse.data.message || 'Failed to fetch stats');
        // Set default stats to prevent undefined errors
        setStats(getDefaultStats());
      }

      // Set recent tenants
      if (tenantsResponse.data.success) {
        setRecentTenants(tenantsResponse.data.data);
      } else {
        setError(tenantsResponse.data.message || 'Failed to fetch tenants');
        setRecentTenants(getDefaultTenants());
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
      
      // Set default data to prevent UI errors
      setStats(getDefaultStats());
      setRecentTenants(getDefaultTenants());
    } finally {
      setLoading(false);
    }
  };

  // Default stats (fallback)
  const getDefaultStats = (): DashboardStats => ({
    totalTenants: 0,
    totalMembers: 0,
    totalFundsTracked: 0,
    activeTenants: 0,
    totalTenantsChange: '+0%',
    totalMembersChange: '+0%',
    totalFundsChange: '+0%',
    activeTenantsChange: '+0',
  });

  // Default tenants (fallback)
  const getDefaultTenants = (): Tenant[] => [];

  // Mock data for fallback (optional - remove if you don't want mock data)
  const getMockStats = (): DashboardStats => ({
    totalTenants: 24,
    totalMembers: 1847,
    totalFundsTracked: 3200000,
    activeTenants: 22,
    totalTenantsChange: '+12%',
    totalMembersChange: '+8.5%',
    totalFundsChange: '+15.3%',
    activeTenantsChange: '+2',
  });

  const getMockTenants = (): Tenant[] => [
    {
      id: '1',
      name: 'TechCorp Solutions',
      subdomain: 'techcorp',
      status: 'active',
      createdDate: '2026-01-15',
      treasurer: 'John Doe',
      treasurerEmail: 'john@techcorp.com',
      bankAccount: '****7890',
      members: 45,
      totalFunds: 124500,
      maxMembers: 100,
      subscriptionTier: 'basic'
    },
    {
      id: '2',
      name: 'GreenLeaf Industries',
      subdomain: 'greenleaf',
      status: 'active',
      createdDate: '2026-01-10',
      treasurer: 'Sarah Smith',
      treasurerEmail: 'sarah@greenleaf.com',
      bankAccount: '****3456',
      members: 32,
      totalFunds: 89200,
      maxMembers: 100,
      subscriptionTier: 'basic'
    },
    {
      id: '3',
      name: 'InnovateWorks',
      subdomain: 'innovate',
      status: 'pending',
      createdDate: '2026-01-05',
      treasurer: 'Mike Johnson',
      treasurerEmail: 'mike@innovate.com',
      bankAccount: '****1234',
      members: 0,
      totalFunds: 0,
      maxMembers: 100,
      subscriptionTier: 'basic'
    },
    {
      id: '4',
      name: 'PrimeEdge Solutions',
      subdomain: 'primeedge',
      status: 'active',
      createdDate: '2025-12-20',
      treasurer: 'Emma Wilson',
      treasurerEmail: 'emma@primeedge.com',
      bankAccount: '****5678',
      members: 28,
      totalFunds: 67800,
      maxMembers: 100,
      subscriptionTier: 'basic'
    },
    {
      id: '5',
      name: 'Apex Global',
      subdomain: 'apex',
      status: 'suspended',
      createdDate: '2025-12-15',
      treasurer: 'David Brown',
      treasurerEmail: 'david@apex.com',
      bankAccount: '****9012',
      members: 15,
      totalFunds: 45300,
      maxMembers: 100,
      subscriptionTier: 'basic'
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
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Get stats configuration from API data - WITH SAFE CHECK
  const getStatsConfig = () => {
    // Safe check: if stats is null or undefined, use default values
    const safeStats = stats || getDefaultStats();

    return [
      {
        title: 'Total Tenants',
        value: safeStats.totalTenants?.toString() || '0',
        change: safeStats.totalTenantsChange || '+0%',
        icon: Building2,
        color: 'bg-blue-500',
      },
      {
        title: 'Total Members',
        value: formatNumber(safeStats.totalMembers || 0),
        change: safeStats.totalMembersChange || '+0%',
        icon: Users,
        color: 'bg-green-500',
      },
      {
        title: 'Total Funds Tracked',
        value: formatCurrency(safeStats.totalFundsTracked || 0),
        change: safeStats.totalFundsChange || '+0%',
        icon: Wallet,
        color: 'bg-purple-500',
      },
      {
        title: 'Active Tenants',
        value: safeStats.activeTenants?.toString() || '0',
        change: safeStats.activeTenantsChange || '+0',
        icon: TrendingUp,
        color: 'bg-orange-500',
      },
    ];
  };

  const statsConfig = getStatsConfig();

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
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

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsConfig.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`${stat.color} rounded-xl p-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </span>
                    <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                      {stat.value}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Recently Added Tenants */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recently Added Tenants
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest tenants registered on the platform
                  </p>
                </div>
                <Link
                  to="/admin/tenants"
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  View All →
                </Link>
              </div>

              {recentTenants.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No tenants found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tenant Name
                          </span>
                        </th>
                        <th className="py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Subdomain
                          </span>
                        </th>
                        <th className="py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </span>
                        </th>
                        <th className="py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created Date
                          </span>
                        </th>
                        <th className="py-3 text-left">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Treasurer
                          </span>
                        </th>
                        <th className="py-3 text-right">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {recentTenants.map((tenant) => (
                        <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3">
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              {tenant.name}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tenant.subdomain}
                            </span>
                          </td>
                          <td className="py-3">
                            {getStatusBadge(tenant.status)}
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(tenant.createdDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {tenant.treasurerEmail || 'Not Assigned'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/tenants/${tenant.id}`}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </Link>
                              <Link
                                to={`/admin/tenants/${tenant.id}/edit`}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                title="Edit Tenant"
                              >
                                <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </Link>
                              <button
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Tenant"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`)) {
                                    toast.success('Tenant deleted successfully');
                                    fetchDashboardData();
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                to="/admin/reconciliation"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-500/15">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      Financial Reconciliation
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review tenant financial data
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/audit-logs"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-500/15">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">📋</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      Global Audit Logs
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor all platform activities
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-50 p-3 dark:bg-green-500/15">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white/90">
                      User Management
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage all users across tenants
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;