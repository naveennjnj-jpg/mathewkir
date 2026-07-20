// pages/AdminAnalytics/AdminAnalytics.tsx
import React, { useState } from 'react';

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Wallet,
  Activity,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  Eye,
  ArrowUp,
  ArrowDown,
  PieChart,
  LineChart,
  Clock,
  DollarSign,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState('this-month');
  const [metricType, setMetricType] = useState('all');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => { if (window.innerWidth < 1024) setIsSidebarOpen(false); };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$1,247,500',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Tenants',
      value: '22',
      change: '+8.3%',
      isPositive: true,
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: '1,847',
      change: '+15.2%',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Collection Rate',
      value: '92.8%',
      change: '-2.1%',
      isPositive: false,
      icon: Wallet,
      color: 'bg-orange-500'
    },
  ];

  const tenantGrowth = [
    { month: 'Jan', tenants: 18, users: 1200, revenue: 85000 },
    { month: 'Feb', tenants: 19, users: 1250, revenue: 92000 },
    { month: 'Mar', tenants: 19, users: 1300, revenue: 88000 },
    { month: 'Apr', tenants: 20, users: 1400, revenue: 95000 },
    { month: 'May', tenants: 21, users: 1480, revenue: 102000 },
    { month: 'Jun', tenants: 22, users: 1550, revenue: 110000 },
    { month: 'Jul', tenants: 22, users: 1650, revenue: 115000 },
    { month: 'Aug', tenants: 23, users: 1720, revenue: 122000 },
    { month: 'Sep', tenants: 23, users: 1800, revenue: 128000 },
    { month: 'Oct', tenants: 24, users: 1847, revenue: 135000 },
  ];

  const topTenants = [
    { name: 'TechCorp Solutions', revenue: '$245,000', users: 145, growth: '+18%' },
    { name: 'GreenLeaf Industries', revenue: '$189,000', users: 98, growth: '+12%' },
    { name: 'PrimeEdge Solutions', revenue: '$156,000', users: 82, growth: '+8%' },
    { name: 'InnovateWorks', revenue: '$112,000', users: 45, growth: '+25%' },
    { name: 'Apex Global', revenue: '$89,000', users: 38, growth: '+5%' },
  ];

  const userActivity = [
    { action: 'Logins', count: 1245, change: '+8%' },
    { action: 'Transactions', count: 892, change: '+12%' },
    { action: 'New Registrations', count: 156, change: '+15%' },
    { action: 'Support Tickets', count: 45, change: '-5%' },
  ];

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getChangeIcon = (change: string) => {
    return change.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

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
              <div className="flex items-center gap-3">
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
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between">
                    <div className={`${stat.color} rounded-xl p-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(stat.change)}`}>
                      {getChangeIcon(stat.change)}
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</span>
                    <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                      {stat.value}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Growth Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Platform Growth</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly growth metrics across all tenants</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-500 text-white">Monthly</button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">Weekly</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="h-[200px] flex items-center justify-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-700" />
                      <p>Chart Component Here</p>
                      <p className="text-xs">(Use your preferred chart library like Recharts, Chart.js, or ApexCharts)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Tenants & User Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
              {/* Top Tenants */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Top Performing Tenants</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">By revenue and user count</p>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <div className="space-y-4">
                  {topTenants.map((tenant, index) => (
                    <div key={index} className="flex items-center justify-between">
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
                        <p className="font-semibold text-gray-800 dark:text-white/90">{tenant.revenue}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{tenant.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Activity */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">User Activity</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Platform engagement metrics</p>
                  </div>
                  <Activity className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
                <div className="space-y-4">
                  {userActivity.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white/90">{item.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.count} total</p>
                      </div>
                      <span className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(item.change)}`}>
                        {getChangeIcon(item.change)}
                        {item.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-500/15">
                    <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">1,642</h4>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 w-[88%] rounded-full bg-blue-500"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">88% of total users active in last 30 days</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-green-50 p-2 dark:bg-green-500/15">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Growth</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">+15.3%</h4>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 w-[15%] rounded-full bg-green-500"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Month-over-month growth</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-yellow-50 p-2 dark:bg-yellow-500/15">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Actions</p>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">23</h4>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 w-[12%] rounded-full bg-yellow-500"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">12 approvals, 8 tickets, 3 pending registrations</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;