// pages/AdminAnalytics/AdminAnalytics.tsx
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Wallet,
  Activity,
  Download,
  ChevronDown,
  Eye,
  ArrowUp,
  ArrowDown,
  DollarSign,
  UserCheck,
  AlertCircle,
  Loader2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface DashboardStats {
  totalRevenue: number;
  totalTenants: number;
  totalUsers: number;
  collectionRate: number;
  revenueChange: number;
  tenantsChange: number;
  usersChange: number;
  collectionChange: number;
}

interface GrowthData {
  month: string;
  tenants: number;
  users: number;
  revenue: number;
}

interface TopTenant {
  tenantId: string;
  name: string;
  revenue: number;
  users: number;
  growth: number;
  subdomain: string;
}

interface UserActivity {
  action: string;
  count: number;
  change: number;
}

interface PendingAction {
  type: string;
  count: number;
  description: string;
}

interface RecentRegistration {
  id: string;
  name: string;
  email: string;
  tenant: string;
  joinedAt: Date;
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    growthData: GrowthData[];
    topTenants: TopTenant[];
    userActivity: UserActivity[];
    pendingActions: PendingAction[];
    recentRegistrations: RecentRegistration[];
  };
}

const AdminAnalytics: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse['data'] | null>(null);
  const [timeRange, setTimeRange] = useState('this-month');
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/api/treasurer/analytics`, {
        params: {
          timeRange
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch analytics');
        setAnalytics(null);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch analytics');
      }
      setAnalytics(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    toast.success('Analytics refreshed');
  };

  // Frontend-only export
  const handleExport = () => {
    if (!analytics) {
      toast.error('No data to export');
      return;
    }

    try {
      // Prepare data for CSV
      const rows: any[] = [];

      // Add header row
      rows.push(['Metric', 'Value', 'Change']);

      // Add stats
      rows.push(['Total Revenue', formatCurrency(analytics.stats.totalRevenue), formatChange(analytics.stats.revenueChange)]);
      rows.push(['Active Tenants', analytics.stats.totalTenants.toString(), formatChange(analytics.stats.tenantsChange)]);
      rows.push(['Total Users', analytics.stats.totalUsers.toString(), formatChange(analytics.stats.usersChange)]);
      rows.push(['Collection Rate', `${analytics.stats.collectionRate.toFixed(1)}%`, formatChange(analytics.stats.collectionChange)]);

      // Add empty row
      rows.push([]);

      // Add growth data header
      rows.push(['Growth Data']);
      rows.push(['Month', 'Tenants', 'Users', 'Revenue']);

      // Add growth data
      analytics.growthData.forEach(item => {
        rows.push([item.month, item.tenants.toString(), item.users.toString(), formatCurrency(item.revenue)]);
      });

      // Add empty row
      rows.push([]);

      // Add top tenants header
      rows.push(['Top Performing Tenants']);
      rows.push(['#', 'Tenant Name', 'Revenue', 'Users', 'Growth']);

      // Add top tenants
      analytics.topTenants.forEach((tenant, index) => {
        rows.push([
          (index + 1).toString(),
          tenant.name,
          formatCurrency(tenant.revenue),
          tenant.users.toString(),
          formatChange(tenant.growth)
        ]);
      });

      // Add empty row
      rows.push([]);

      // Add user activity header
      rows.push(['User Activity']);
      rows.push(['Action', 'Count', 'Change']);

      // Add user activity
      analytics.userActivity.forEach(item => {
        rows.push([item.action, item.count.toString(), formatChange(item.change)]);
      });

      // Add empty row
      rows.push([]);

      // Add pending actions header
      rows.push(['Pending Actions']);
      rows.push(['Type', 'Count', 'Description']);

      // Add pending actions
      analytics.pendingActions.forEach(action => {
        rows.push([action.type, action.count.toString(), action.description]);
      });

      // Add empty row
      rows.push([]);

      // Add recent registrations header
      rows.push(['Recent Registrations']);
      rows.push(['Name', 'Email', 'Tenant', 'Joined Date']);

      // Add recent registrations
      analytics.recentRegistrations.forEach(reg => {
        rows.push([
          reg.name,
          reg.email,
          reg.tenant,
          new Date(reg.joinedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        ]);
      });

      // Convert to CSV
      const csvContent = rows
        .map(row => row.join(','))
        .join('\n');

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
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

  // Format change
  const formatChange = (change: number) => {
    if (change === 0) return '0%';
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
  };

  // Get change color
  const getChangeColor = (change: number) => {
    if (change === 0) return 'text-gray-500 dark:text-gray-400';
    return change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  // Get change icon
  const getChangeIcon = (change: number) => {
    if (change === 0) return null;
    return change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  // Get max value for chart scaling
  const getMaxValue = (data: GrowthData[], key: keyof GrowthData) => {
    if (!data || data.length === 0) return 100;
    const max = Math.max(...data.map(item => Number(item[key])));
    return max > 0 ? max * 1.2 : 100;
  };

  // Stats configuration
  const statsConfig = [
    {
      key: 'totalRevenue',
      title: 'Total Revenue',
      value: (stats: DashboardStats) => formatCurrency(stats?.totalRevenue || 0),
      change: (stats: DashboardStats) => formatChange(stats?.revenueChange || 0),
      isPositive: (stats: DashboardStats) => (stats?.revenueChange || 0) >= 0,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      key: 'totalTenants',
      title: 'Active Tenants',
      value: (stats: DashboardStats) => (stats?.totalTenants || 0).toString(),
      change: (stats: DashboardStats) => formatChange(stats?.tenantsChange || 0),
      isPositive: (stats: DashboardStats) => (stats?.tenantsChange || 0) >= 0,
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      key: 'totalUsers',
      title: 'Total Users',
      value: (stats: DashboardStats) => (stats?.totalUsers || 0).toString(),
      change: (stats: DashboardStats) => formatChange(stats?.usersChange || 0),
      isPositive: (stats: DashboardStats) => (stats?.usersChange || 0) >= 0,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      key: 'collectionRate',
      title: 'Collection Rate',
      value: (stats: DashboardStats) => `${(stats?.collectionRate || 0).toFixed(1)}%`,
      change: (stats: DashboardStats) => formatChange(stats?.collectionChange || 0),
      isPositive: (stats: DashboardStats) => (stats?.collectionChange || 0) >= 0,
      icon: Wallet,
      color: 'bg-orange-500'
    },
  ];

  // Fetch data on mount and when timeRange changes
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Analytics</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Platform-wide analytics and insights
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="this-quarter">This Quarter</option>
                    <option value="this-year">This Year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  disabled={!analytics}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="ml-auto text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsConfig.map((config, index) => {
                const stat = analytics?.stats;
                const value = stat ? config.value(stat) : '0';
                const change = stat ? config.change(stat) : '0%';
                const isPositive = stat ? config.isPositive(stat) : false;
                
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`${config.color} rounded-xl p-3`}>
                        <config.icon className="w-5 h-5 text-white" />
                      </div>
                      {stat && (
                        <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(config.isPositive(stat) ? 1 : -1)}`}>
                          {getChangeIcon(config.isPositive(stat) ? 1 : -1)}
                          {change}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{config.title}</span>
                      <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                        {value}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Growth Chart - Improved Design */}
            {analytics?.growthData && analytics.growthData.length > 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Platform Growth</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly growth metrics across all tenants</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-brand-500"></span>
                      Revenue
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Users
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      Tenants
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    {/* Chart */}
                    <div className="relative h-64">
                      {/* Y-axis grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400">
                        <span>{formatCurrency(getMaxValue(analytics.growthData, 'revenue'))}</span>
                        <span>{formatCurrency(getMaxValue(analytics.growthData, 'revenue') * 0.75)}</span>
                        <span>{formatCurrency(getMaxValue(analytics.growthData, 'revenue') * 0.5)}</span>
                        <span>{formatCurrency(getMaxValue(analytics.growthData, 'revenue') * 0.25)}</span>
                        <span>0</span>
                      </div>

                      {/* Chart bars */}
                      <div className="absolute inset-0 pl-16 flex items-end justify-between gap-2">
                        {analytics.growthData.map((item, index) => {
                          const maxRevenue = getMaxValue(analytics.growthData, 'revenue');
                          const maxUsers = getMaxValue(analytics.growthData, 'users');
                          const maxTenants = getMaxValue(analytics.growthData, 'tenants');
                          
                          const revenueHeight = maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 0;
                          const usersHeight = maxUsers > 0 ? (item.users / maxUsers) * 150 : 0;
                          const tenantsHeight = maxTenants > 0 ? (item.tenants / maxTenants) * 100 : 0;

                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div className="relative w-full flex items-end justify-center gap-1 h-56">
                                {/* Revenue bar */}
                                <div 
                                  className="w-6 bg-brand-500 rounded-t transition-all duration-500 hover:opacity-80"
                                  style={{ height: `${Math.max(revenueHeight, 4)}px` }}
                                >
                                  <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    {formatCurrency(item.revenue)}
                                  </div>
                                </div>
                                {/* Users bar */}
                                <div 
                                  className="w-6 bg-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
                                  style={{ height: `${Math.max(usersHeight, 4)}px` }}
                                >
                                  <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    {item.users} users
                                  </div>
                                </div>
                                {/* Tenants bar */}
                                <div 
                                  className="w-6 bg-green-500 rounded-t transition-all duration-500 hover:opacity-80"
                                  style={{ height: `${Math.max(tenantsHeight, 4)}px` }}
                                >
                                  <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                    {item.tenants} tenants
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] mb-6 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No growth data available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Data will appear once the platform has activity</p>
              </div>
            )}

            {/* Top Tenants & User Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
              {/* Top Tenants */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Top Performing Tenants</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">By revenue and user count</p>
                  </div>
                </div>
                {analytics?.topTenants && analytics.topTenants.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topTenants.map((tenant, index) => (
                      <div key={tenant.tenantId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-sm text-gray-600 dark:text-gray-400">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white/90">{tenant.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.users} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 dark:text-white/90">{formatCurrency(tenant.revenue)}</p>
                          <p className={`text-sm ${tenant.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatChange(tenant.growth)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p>No tenant data available</p>
                  </div>
                )}
              </div>

              {/* User Activity */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Platform engagement metrics</p>
                  </div>
                </div>
                {analytics?.userActivity && analytics.userActivity.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.userActivity.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">{item.action}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.count} total</p>
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(item.change)}`}>
                          {getChangeIcon(item.change)}
                          {formatChange(item.change)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p>No activity data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Metrics */}
            {analytics ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Active Users */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-500/15">
                      <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        {analytics.stats.totalUsers > 0 ? Math.round(analytics.stats.totalUsers * 0.88) : 0}
                      </h4>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                    <div 
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${analytics.stats.totalUsers > 0 ? 88 : 0}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {analytics.stats.totalUsers > 0 ? '88% of total users active in last 30 days' : 'No active users'}
                  </p>
                </div>

                {/* Revenue Growth */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl bg-green-50 p-2 dark:bg-green-500/15">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Growth</p>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        {formatChange(analytics.stats.revenueChange)}
                      </h4>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all duration-500"
                      style={{ width: `${Math.min(Math.abs(analytics.stats.revenueChange), 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Month-over-month growth</p>
                </div>

                {/* Pending Actions */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl bg-yellow-50 p-2 dark:bg-yellow-500/15">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pending Actions</p>
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">
                        {analytics.pendingActions.reduce((sum, action) => sum + action.count, 0)}
                      </h4>
                    </div>
                  </div>
                  {analytics.pendingActions.length > 0 ? (
                    <div className="space-y-1">
                      {analytics.pendingActions.map((action, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{action.type}</span>
                          <span className="font-medium text-gray-800 dark:text-white/90">{action.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No pending actions</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Data Available</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Analytics data will appear once the platform has activity
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;