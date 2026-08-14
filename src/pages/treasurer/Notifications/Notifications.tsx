// pages/admin/Notifications.tsx
import React, { useState, useEffect } from 'react';
import {
    Bell,
    CheckCircle,
    Clock,
    AlertCircle,
    DollarSign,
    Users,
    Mail,
    Calendar,
    Settings,
    FileText,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    X,
    Building2,
    User,
    MessageSquare
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Notification {
    notification_id: string;
    tenant_id: string;
    user_id: string;
    type: string;
    channel: string | null;
    message: string;
    sent_at: string;
    read_at: string | null;
    tenant: {
        tenant_id: string;
        name: string;
    };
    user: {
        user_id: string;
        full_name: string;
        email: string;
    };
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Get icon for notification type
    const getNotificationIcon = (type?: string) => {
        if (!type) return Bell;

        const typeMap: Record<string, any> = {
            'payment_approved': CheckCircle,
            'payment_pending': Clock,
            'payment_failed': AlertCircle,
            'payment_received': DollarSign,
            'user_registered': Users,
            'user_invited': Mail,
            'event_created': Calendar,
            'event_updated': Calendar,
            'system_update': Settings,
            'project_submitted': FileText,
            'project_approved': CheckCircle,
            'project_rejected': AlertCircle,
        };

        return typeMap[type] || Bell;
    };

    // Get color for notification type
    const getNotificationColor = (type?: string) => {
        if (!type) return 'text-gray-500 bg-gray-100 dark:bg-gray-800';

        const colorMap: Record<string, string> = {
            'payment_approved': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            'payment_pending': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
            'payment_failed': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
            'payment_received': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            'user_registered': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
            'user_invited': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
            'event_created': 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400',
            'event_updated': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
            'system_update': 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
            'project_submitted': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
            'project_approved': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
            'project_rejected': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
        };

        return colorMap[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    };

    // Get type display name
    const getTypeDisplayName = (type: string) => {
        if (!type) return 'Notification';

        const typeMap: Record<string, string> = {
            'payment_approved': 'Payment Approved',
            'payment_pending': 'Payment Pending',
            'payment_failed': 'Payment Failed',
            'payment_received': 'Payment Received',
            'user_registered': 'New User Registered',
            'user_invited': 'User Invited',
            'event_created': 'Event Created',
            'event_updated': 'Event Updated',
            'system_update': 'System Update',
            'project_submitted': 'Project Submitted',
            'project_approved': 'Project Approved',
            'project_rejected': 'Project Rejected',
        };

        return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Format time
    const formatTime = (date: string) => {
        if (!date) return 'N/A';

        try {
            const now = new Date();
            const notificationDate = new Date(date);
            const diffMs = now.getTime() - notificationDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} min ago`;
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

            return notificationDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/treasurer/allnotifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success && Array.isArray(response.data.data)) {
                setNotifications(response.data.data);
            } else {
                setNotifications([]);
            }
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter notifications by search
    const filteredNotifications = notifications.filter(notification => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                notification.message.toLowerCase().includes(search) ||
                notification.type.toLowerCase().includes(search) ||
                notification.user.full_name.toLowerCase().includes(search) ||
                notification.user.email.toLowerCase().includes(search) ||
                notification.tenant.name.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Pagination
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotifications = filteredNotifications.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Fetch on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const totalCount = filteredNotifications.length;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-3">
                        <Bell className="w-6 h-6 text-brand-500" />
                        Notifications
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Total: {totalCount} notifications
                    </p>
                </div>
                <button
                    onClick={fetchNotifications}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    />
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
                    </div>
                </div>
            ) : currentNotifications.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                    <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">No notifications found</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search' : 'You\'re all caught up!'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {currentNotifications.map((notification) => {
                                const IconComponent = getNotificationIcon(notification.type);
                                const colorClass = getNotificationColor(notification.type);

                                return (
                                    <div
                                        key={notification.notification_id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setSelectedNotification(notification);
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`p-2 rounded-xl flex-shrink-0 ${colorClass}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                                                {getTypeDisplayName(notification.type)}
                                                            </h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                                            <span className="flex items-center gap-1">
                                                                <Building2 className="w-3 h-3" />
                                                                {notification.tenant.name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {notification.user.full_name}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatTime(notification.sent_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedNotification(notification);
                                                                setShowDetailModal(true);
                                                            }}
                                                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                            title="View details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredNotifications.length)} of {filteredNotifications.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-white/5"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:hover:bg-white/5"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Detail Modal - Using frontend data, no API call */}
            {showDetailModal && selectedNotification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="absolute right-4 top-4 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-xl ${getNotificationColor(selectedNotification.type)}`}>
                                {React.createElement(getNotificationIcon(selectedNotification.type), { className: "w-6 h-6" })}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                                    {getTypeDisplayName(selectedNotification.type)}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Notification Details
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Message */}
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {selectedNotification.message}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                        {getTypeDisplayName(selectedNotification.type)}
                                    </p>
                                </div>
                                {/* <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {selectedNotification.read_at ? (
                      <span className="text-green-600 dark:text-green-400">Read</span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">Unread</span>
                    )}
                  </p>
                </div> */}
                                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tenant</p>
                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                        {selectedNotification.tenant.name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        ID: {selectedNotification.tenant_id}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                        {selectedNotification.user.full_name}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {selectedNotification.user.email}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Sent At</p>
                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                        {new Date(selectedNotification.sent_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {/* <div>
                                    {selectedNotification.read_at && (
                                        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Read At</p>
                                            <p className="font-medium text-gray-800 dark:text-white/90">
                                                {new Date(selectedNotification.read_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Notification ID</p>
                                        <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                                            {selectedNotification.notification_id}
                                        </p>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;