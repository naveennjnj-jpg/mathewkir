// pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  FolderKanban,
  UserCheck,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CircleAlert,
  CircleCheck,
  Timer,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  activeExperts: number;
  monthlyRevenue: number;
  usersGrowth: number;
  projectsGrowth: number;
  expertsGrowth: number;
  revenueGrowth: number;
}

interface ChartData {
  month: string;
  users: number;
  revenue: number;
  projects: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartType, setChartType] = useState<'users' | 'revenue'>('users');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1284,
    activeProjects: 348,
    activeExperts: 42,
    monthlyRevenue: 16800,
    usersGrowth: 12.4,
    projectsGrowth: 8.1,
    expertsGrowth: 3,
    revenueGrowth: -2.3
  });

  // Generate mock chart data
  const generateChartData = (): ChartData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      users: Math.floor(800 + Math.random() * 600) + (index * 30),
      revenue: Math.floor(8000 + Math.random() * 8000) + (index * 500),
      projects: Math.floor(200 + Math.random() * 200) + (index * 15)
    }));
  };

  useEffect(() => {
    // Initialize chart data
    setChartData(generateChartData());
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setStats({
          totalUsers: data.totalUsers || 1284,
          activeProjects: data.activeProjects || 348,
          activeExperts: data.activeExperts || 42,
          monthlyRevenue: data.monthlyRevenue || 16800,
          usersGrowth: data.usersGrowth || 12.4,
          projectsGrowth: data.projectsGrowth || 8.1,
          expertsGrowth: data.expertsGrowth || 3,
          revenueGrowth: data.revenueGrowth || -2.3
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setChartData(generateChartData());
    fetchDashboardStats();
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.usersGrowth}%`,
      isPositive: stats.usersGrowth > 0,
      icon: Users,
      color: "#4F6EF7",
      bgColor: "rgba(79, 110, 247, 0.094)"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toLocaleString(),
      change: `+${stats.projectsGrowth}%`,
      isPositive: stats.projectsGrowth > 0,
      icon: FolderKanban,
      color: "#22C9A5",
      bgColor: "rgba(34, 201, 165, 0.094)"
    },
    {
      title: "Active Experts",
      value: stats.activeExperts.toLocaleString(),
      change: `+${stats.expertsGrowth}`,
      isPositive: stats.expertsGrowth > 0,
      icon: UserCheck,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.094)"
    },
    {
      title: "Monthly Revenue",
      value: `R ${stats.monthlyRevenue.toLocaleString()}`,
      change: `${stats.revenueGrowth}%`,
      isPositive: stats.revenueGrowth > 0,
      icon: CreditCard,
      color: "#E05C97",
      bgColor: "rgba(224, 92, 151, 0.094)"
    }
  ];

  const recentActivities = [
    {
      icon: Users,
      title: "New user registered",
      description: "Amara Nwosu joined as B2C user",
      time: "2 min ago",
      color: "#4F6EF7"
    },
    {
      icon: FolderKanban,
      title: "Project submitted",
      description: "Journal Article by Ronald Sithole marked for review",
      time: "14 min ago",
      color: "#22C9A5"
    },
    {
      icon: UserCheck,
      title: "Expert onboarded",
      description: "Dr. Sipho Dlamini added as Research Expert",
      time: "1 hr ago",
      color: "#F59E0B"
    },
    {
      icon: CreditCard,
      title: "Subscription upgraded",
      description: "Wits University upgraded to Enterprise plan",
      time: "2 hr ago",
      color: "#E05C97"
    },
    {
      icon: CreditCard,
      title: "Credit plan purchased",
      description: "Lerato Molefe purchased Premium 500 credits",
      time: "3 hr ago",
      color: "#E05C97"
    },
    {
      icon: FolderKanban,
      title: "Project completed",
      description: "Policy Brief by Thabo Nkosi marked complete",
      time: "5 hr ago",
      color: "#22C9A5"
    }
  ];

  const statusCards = [
    {
      title: "Projects In Review",
      value: "24",
      icon: CircleAlert,
      bgColor: "bg-amber-50 border-amber-100",
      iconColor: "text-amber-500",
      iconBg: "bg-white"
    },
    {
      title: "Projects Completed This Month",
      value: "87",
      icon: CircleCheck,
      bgColor: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-600",
      iconBg: "bg-white"
    },
    {
      title: "Pending Expert Applications",
      value: "6",
      icon: Timer,
      bgColor: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-500",
      iconBg: "bg-white"
    }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-[#0F2D63] dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for pie chart
  const COLORS = ['#4F6EF7', '#22C9A5', '#F59E0B', '#E05C97'];

  // Pie chart data
  const pieData = [
    { name: 'Active Users', value: stats.totalUsers * 0.6 },
    { name: 'New Users', value: stats.totalUsers * 0.25 },
    { name: 'Inactive Users', value: stats.totalUsers * 0.15 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Platform health and activity at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#0F2D63] text-white rounded-lg hover:bg-[#1a3a7a] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bgColor }}
              >
                <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  stat.isPositive ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {stat.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F2D63] dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-[#0F2D63] dark:text-white text-sm">Platform Growth</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setChartType('users')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  chartType === 'users'
                    ? 'bg-[#0F2D63] text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                User Signups
              </button>
              <button
                onClick={() => setChartType('revenue')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  chartType === 'revenue'
                    ? 'bg-[#0F2D63] text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'users' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#4F6EF7" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name="Total Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#4F6EF7" 
                    strokeWidth={2}
                    dot={{ fill: '#4F6EF7', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Users Trend"
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `R${value/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#E05C97" 
                    name="Revenue (R)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

{/* Recent Activity */}
<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
  <div className="flex items-center gap-2 mb-4">
    <Activity className="w-[15px] h-[15px] text-[#C85A32]" />
    <h2 className="font-semibold text-[#0F2D63] dark:text-white text-sm">
      Recent Activity
    </h2>
  </div>

  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
    {recentActivities.map((activity, index) => (
      <div key={index} className="flex gap-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${activity.color}20` }}
        >
          <activity.icon
            className="w-[13px] h-[13px]"
            style={{ color: activity.color }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#0F2D63] dark:text-white leading-tight">
            {activity.title}
          </p>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight truncate">
            {activity.description}
          </p>

          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-[9px] h-[9px]" />
            {activity.time}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} border rounded-2xl p-4 flex items-center gap-4 dark:bg-gray-800 dark:border-gray-700`}
          >
            <div className={`w-9 h-9 ${card.iconBg} rounded-xl flex items-center justify-center shadow-sm dark:bg-gray-700`}>
              <card.icon className={`w-[15px] h-[15px] ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F2D63] dark:text-white">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;