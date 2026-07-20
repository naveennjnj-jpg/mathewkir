// pages/superadmin/SuperAdminDashboard.tsx
import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Mock data
  const stats = [
    {
      title: 'Total Tenants',
      value: '24',
      change: '+12%',
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Members',
      value: '1,847',
      change: '+8.5%',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Funds Tracked',
      value: '$3.2M',
      change: '+15.3%',
      icon: Wallet,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Tenants',
      value: '22',
      change: '+2',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentTenants = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      subdomain: 'techcorp',
      status: 'active',
      createdDate: '2026-01-15',
      treasurer: 'john@techcorp.com',
    },
    {
      id: 2,
      name: 'GreenLeaf Industries',
      subdomain: 'greenleaf',
      status: 'active',
      createdDate: '2026-01-10',
      treasurer: 'sarah@greenleaf.com',
    },
    {
      id: 3,
      name: 'InnovateWorks',
      subdomain: 'innovate',
      status: 'pending',
      createdDate: '2026-01-05',
      treasurer: 'mike@innovate.com',
    },
    {
      id: 4,
      name: 'PrimeEdge Solutions',
      subdomain: 'primeedge',
      status: 'active',
      createdDate: '2025-12-20',
      treasurer: 'emma@primeedge.com',
    },
    {
      id: 5,
      name: 'Apex Global',
      subdomain: 'apex',
      status: 'suspended',
      createdDate: '2025-12-15',
      treasurer: 'david@apex.com',
    },
  ];

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
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
                <Plus className="w-4 h-4" />
                Add New Tenant
              </button>
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
                  to="/super-admin/tenants"
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  View All →
                </Link>
              </div>

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
                      <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
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
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              tenant.status === 'active'
                                ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                                : tenant.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500'
                                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                            }`}
                          >
                            {tenant.status === 'active' && <CheckCircle className="w-3 h-3" />}
                            {tenant.status === 'pending' && <Clock className="w-3 h-3" />}
                            {tenant.status === 'suspended' && <XCircle className="w-3 h-3" />}
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tenant.createdDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {tenant.treasurer}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                to="/super-admin/reconciliation"
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
                to="/super-admin/audit-logs"
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-500 transition-colors dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-500/15">
                    {/* <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" /> */}
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
                to="/super-admin/users"
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