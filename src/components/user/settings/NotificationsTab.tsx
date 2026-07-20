// components/settings/NotificationsTab.tsx
import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, Save } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface NotificationItem {
  id: number;
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    _id?: string;
    userId?: string;
    project_updates?: boolean;
    workshop_reminders?: boolean;
    expert_bookings?: boolean;
    weekly_digest?: boolean;
    product_news?: boolean;
    billing_alerts?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
}

const NotificationsTab = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Default notification items
  const defaultNotifications: NotificationItem[] = [
    {
      id: 1,
      key: "project_updates",
      title: "Project Updates",
      description: "Notifications when your projects are updated or reviewed",
      enabled: true,
    },
    {
      id: 2,
      key: "workshop_reminders",
      title: "Workshop Reminders",
      description: "Reminders before registered workshops and training sessions",
      enabled: true,
    },
    {
      id: 3,
      key: "expert_bookings",
      title: "Expert Bookings",
      description: "Confirmations and updates for booked consultations",
      enabled: true,
    },
    {
      id: 4,
      key: "weekly_digest",
      title: "Weekly Digest",
      description: "A summary of activity and new content every Monday",
      enabled: false,
    },
    {
      id: 5,
      key: "product_news",
      title: "Product News",
      description: "Updates about new features and improvements",
      enabled: true,
    },
    {
      id: 6,
      key: "billing_alerts",
      title: "Billing Alerts",
      description: "Invoices, payment confirmations, and billing issues",
      enabled: true,
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/auth/notification-preferences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success && response.data.data) {
        // The notification data is directly in response.data.data
        const notificationData = response.data.data;
        
        // Map API data to notification items
        const mappedNotifications = defaultNotifications.map((item) => {
          const value = notificationData[item.key as keyof typeof notificationData];
          return {
            ...item,
            enabled: typeof value === "boolean" ? value : item.enabled,
          };
        });
        
        setNotifications(mappedNotifications);
      } else {
        setNotifications(defaultNotifications);
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setNotifications(defaultNotifications);
      setError("Could not load notification preferences. Using defaults.");
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = (id: number) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare data for API - create an object with all notification keys
      const notificationData = notifications.reduce((acc, item) => {
        acc[item.key] = item.enabled;
        return acc;
      }, {} as Record<string, boolean>);

      console.log("Saving notification data:", notificationData);

      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/notification-preferences`,
        notificationData, // Send directly as the request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to save notification preferences");
      }
    } catch (err: any) {
      console.error("Error saving notifications:", err);
      setError(err.response?.data?.message || "Failed to save notification preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-[#0F2D63] mb-5">
        Notification Preferences
      </h2>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4" />
          <span>Notification preferences saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-[#0F2D63]">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {item.description}
              </p>
            </div>
            <button
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                item.enabled ? 'bg-[#C85A32]' : 'bg-gray-200'
              }`}
              onClick={() => toggleNotification(item.id)}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  item.enabled ? 'left-6' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-5 flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Preferences
          </>
        )}
      </button>
    </div>
  );
};

export default NotificationsTab;