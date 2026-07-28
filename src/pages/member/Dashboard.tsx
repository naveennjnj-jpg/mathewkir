// pages/member/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Calendar,
  Bell,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface OutstandingDues {
  totalAmount: number;
  dueDate: string;
  status: 'overdue' | 'upcoming' | 'paid';
  items: DuesItem[];
}

interface DuesItem {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface FundraisingEvent {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  status: 'active' | 'upcoming' | 'ended';
  raisedAmount?: number;
  targetAmount?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
}

const MemberDashboard: React.FC = () => {
  const [outstandingDues, setOutstandingDues] = useState<OutstandingDues | null>(null);
  const [activeEvents, setActiveEvents] = useState<FundraisingEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('Member');

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.get(`${API_URL}/api/member/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setOutstandingDues(response.data.data.outstandingDues);
        setActiveEvents(response.data.data.activeEvents || []);
        setNotifications(response.data.data.notifications || []);
        setMemberName(response.data.data.memberName || 'Member');
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
        setMockData();
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
      
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const setMockData = () => {
    setOutstandingDues({
      totalAmount: 750,
      dueDate: '2026-08-15',
      status: 'overdue',
      items: [
        { id: '1', description: 'Monthly Dues - July 2026', amount: 250, dueDate: '2026-07-31', status: 'overdue' },
        { id: '2', description: 'Monthly Dues - August 2026', amount: 250, dueDate: '2026-08-31', status: 'pending' },
        { id: '3', description: 'Special Assessment - Building Fund', amount: 250, dueDate: '2026-09-15', status: 'pending' },
      ]
    });

    setActiveEvents([
      {
        id: '1',
        name: 'Annual Community Fundraiser',
        amount: 100,
        deadline: '2026-12-31',
        status: 'active',
        raisedAmount: 4500,
        targetAmount: 10000
      },
      {
        id: '2',
        name: 'Park Renovation Project',
        amount: 50,
        deadline: '2026-10-15',
        status: 'active',
        raisedAmount: 2800,
        targetAmount: 5000
      },
      {
        id: '3',
        name: 'Holiday Food Drive',
        amount: 25,
        deadline: '2026-11-30',
        status: 'upcoming',
        raisedAmount: 0,
        targetAmount: 2000
      }
    ]);

    setNotifications([
      {
        id: '1',
        title: 'Payment Reminder',
        message: 'Your monthly dues for July 2026 are overdue. Please make a payment.',
        type: 'warning',
        date: '2026-07-28T10:30:00',
        read: false
      },
      {
        id: '2',
        title: 'New Event: Annual Fundraiser',
        message: 'Join us for the Annual Community Fundraiser on December 15th!',
        type: 'info',
        date: '2026-07-25T14:20:00',
        read: false
      },
      {
        id: '3',
        title: 'Payment Confirmed',
        message: 'Your payment of $250 for June 2026 dues has been confirmed.',
        type: 'success',
        date: '2026-07-20T09:15:00',
        read: true
      },
      {
        id: '4',
        title: 'Member Meeting',
        message: 'Monthly member meeting scheduled for August 5th at 6:00 PM.',
        type: 'info',
        date: '2026-07-18T16:45:00',
        read: true
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'System will be down for maintenance on August 1st from 2-4 AM.',
        type: 'info',
        date: '2026-07-15T08:00:00',
        read: true
      }
    ]);
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
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        icon: CheckCircle,
        className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        label: 'Active',
      },
      upcoming: {
        icon: Clock,
        className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500',
        label: 'Upcoming',
      },
      ended: {
        icon: XCircle,
        className: 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500',
        label: 'Ended',
      },
      paid: {
        icon: CheckCircle,
        className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        label: 'Paid',
      },
      pending: {
        icon: Clock,
        className: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500',
        label: 'Pending',
      },
      overdue: {
        icon: AlertCircle,
        className: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500',
        label: 'Overdue',
      },
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    const icons = {
      info: <AlertCircle className="w-5 h-5 text-blue-500" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <XCircle className="w-5 h-5 text-red-500" />,
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  // Handle pay now
  const handlePayNow = () => {
    toast.success('Redirecting to payment...');
    // Navigate to payment page
    // window.location.href = '/member/payment';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 mx-auto max-w-7xl md:p-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Welcome back, {memberName}! 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here's what's happening with your dues and events
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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

        {/* Outstanding Dues - Highlighted Card */}
        {outstandingDues && (
          <div className="mb-6">
            <div className={`rounded-2xl p-6 border-2 ${
              outstandingDues.status === 'overdue' 
                ? 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30' 
                : 'bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-500/10 dark:to-blue-500/10 border-brand-200 dark:border-brand-500/20'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    outstandingDues.status === 'overdue'
                      ? 'bg-red-500'
                      : 'bg-brand-500'
                  }`}>
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      Outstanding Dues
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {outstandingDues.status === 'overdue' 
                        ? '⚠️ Payment overdue - please pay immediately'
                        : `Due by ${formatDate(outstandingDues.dueDate)}`
                      }
                    </p>
                  </div>
                </div>
                {getStatusBadge(outstandingDues.status)}
              </div>

              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount Due</p>
                  <p className="text-4xl font-bold text-gray-800 dark:text-white/90">
                    {formatCurrency(outstandingDues.totalAmount)}
                  </p>
                  {outstandingDues.items && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      {outstandingDues.items.length} items pending
                    </p>
                  )}
                </div>
                {/* <button
                  onClick={handlePayNow}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button> */}
              </div>

              {/* Dues Breakdown */}
              {outstandingDues.items && outstandingDues.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {outstandingDues.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{item.description}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {formatCurrency(item.amount)}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    ))}
                    {outstandingDues.items.length > 3 && (
                      <Link to="/member/dues" className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">
                        View all {outstandingDues.items.length} items →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Fundraising Events - Takes 2/3 of space */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Active Fundraising Events
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Events you can participate in
                  </p>
                </div>
                <Link
                  to="/member/events"
                  className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {activeEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No active events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-200 transition-colors"
                    >
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-white/90">
                              {event.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Contribution: {formatCurrency(event.amount)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Deadline: {formatDate(event.deadline)}
                              </span>
                            </div>
                            {event.raisedAmount !== undefined && event.targetAmount !== undefined && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round((event.raisedAmount / event.targetAmount) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className="bg-brand-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min((event.raisedAmount / event.targetAmount) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(event.status)}
                        <button
                          onClick={() => toast.success(`Contributing to ${event.name}`)}
                          className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25"
                        >
                          Contribute
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications - Takes 1/3 of space */}
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest updates
                  </p>
                </div>
                <Link
                  to="/member/notifications"
                  className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                        !notification.read 
                          ? 'bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-800 dark:text-white/90`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {getTimeAgo(notification.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;