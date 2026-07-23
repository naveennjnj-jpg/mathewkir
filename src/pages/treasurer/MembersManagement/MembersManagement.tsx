// pages/treasurer/MembersManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  outstandingDues: number;
  totalPaid: number;
}

const MembersManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });

  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.get(`${API_URL}/api/treasurer/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
      // Mock data
      setMembers(getMockMembers());
    } finally {
      setLoading(false);
    }
  };

  const getMockMembers = (): Member[] => [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      joinDate: '2026-01-15',
      status: 'active',
      outstandingDues: 500,
      totalPaid: 1250
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234-567-8901',
      joinDate: '2026-01-10',
      status: 'active',
      outstandingDues: 0,
      totalPaid: 2000
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234-567-8902',
      joinDate: '2026-01-05',
      status: 'inactive',
      outstandingDues: 750,
      totalPaid: 500
    }
  ];

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.post(
        `${API_URL}/api/treasurer/members`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Member added successfully');
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', status: 'active' });
        fetchMembers();
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    }
  };

  const handleUpdateMember = async (memberId: string, data: Partial<Member>) => {
    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.put(
        `${API_URL}/api/treasurer/members/${memberId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Member updated successfully');
        fetchMembers();
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Failed to update member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.delete(
        `${API_URL}/api/treasurer/members/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Member deleted successfully');
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Parse CSV preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj: any, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {});
        });
        setCsvPreview(rows.slice(0, 5));
      };
      reader.readAsText(file);
    }
  };

  const handleImportCSV = async () => {
    // Validate and import
    const errors: string[] = [];
    csvPreview.forEach((row, index) => {
      if (!row[columnMapping.email] || !row[columnMapping.email].includes('@')) {
        errors.push(`Row ${index + 1}: invalid email`);
      }
      if (!row[columnMapping.name]) {
        errors.push(`Row ${index + 1}: missing name`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      const response = await axios.post(
        `${API_URL}/api/treasurer/members/import`,
        {
          members: csvPreview.map(row => ({
            name: row[columnMapping.name],
            email: row[columnMapping.email],
            phone: row[columnMapping.phone] || ''
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Members imported successfully');
        setShowImportModal(false);
        setCsvFile(null);
        setCsvPreview([]);
        setValidationErrors([]);
        fetchMembers();
      }
    } catch (error) {
      console.error('Error importing members:', error);
      toast.error('Failed to import members');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Members Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all members of your tenant
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding Dues</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {member.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                        : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                    }`}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                    {formatCurrency(member.outstandingDues)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleUpdateMember(member.id, { status: member.status === 'active' ? 'inactive' : 'active' })}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {member.status === 'active' ? (
                          <XCircle className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Import CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csvFile"
                />
                <label htmlFor="csvFile" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">Click or drag to upload CSV file</p>
                  <p className="text-sm text-gray-400">Supports .csv files</p>
                </label>
              </div>

              {/* Column Mapping */}
              {csvPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Column Mapping</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(columnMapping).map((field) => (
                      <select
                        key={field}
                        value={columnMapping[field as keyof typeof columnMapping]}
                        onChange={(e) => setColumnMapping({
                          ...columnMapping,
                          [field]: e.target.value
                        })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                      >
                        <option value="">Select {field}</option>
                        {Object.keys(csvPreview[0]).map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {csvPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50 dark:bg-gray-800">
                          {Object.keys(csvPreview[0]).map((header) => (
                            <th key={header} className="px-3 py-2 text-left">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, i) => (
                              <td key={i} className="px-3 py-2">{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-600 mb-2">Validation Errors</h4>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCSV}
                  disabled={!csvFile}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  Import Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;