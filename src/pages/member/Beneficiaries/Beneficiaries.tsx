// pages/member/Beneficiaries.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  UserPlus,
  Edit,
  Trash2,
  User,
  Users,
  Heart,
  Baby,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  X,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Plus,
  MoreVertical,
  Shield,
  Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface Beneficiary {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'other';
  dateOfBirth: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface BeneficiaryFormData {
  name: string;
  relationship: string;
  dateOfBirth: string;
  phone: string;
  email: string;
}

const Beneficiaries: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BeneficiaryFormData>({
    name: '',
    relationship: '',
    dateOfBirth: '',
    phone: '',
    email: ''
  });

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Relationship options
  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse', icon: <Heart className="w-4 h-4" /> },
    { value: 'child', label: 'Child', icon: <Baby className="w-4 h-4" /> },
    { value: 'parent', label: 'Parent', icon: <UserCircle className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <Users className="w-4 h-4" /> },
  ];

  // Get relationship icon
  const getRelationshipIcon = (relationship: string) => {
    const icons = {
      spouse: <Heart className="w-5 h-5 text-red-500" />,
      child: <Baby className="w-5 h-5 text-blue-500" />,
      parent: <UserCircle className="w-5 h-5 text-green-500" />,
      other: <Users className="w-5 h-5 text-purple-500" />,
    };
    return icons[relationship as keyof typeof icons] || icons.other;
  };

  // Get relationship label
  const getRelationshipLabel = (relationship: string) => {
    const labels = {
      spouse: 'Spouse',
      child: 'Child',
      parent: 'Parent',
      other: 'Other',
    };
    return labels[relationship as keyof typeof labels] || relationship;
  };

  // Fetch beneficiaries
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);

      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.get(`${API_URL}/api/member/beneficiaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setBeneficiaries(response.data.data.beneficiaries);
        setFilteredBeneficiaries(response.data.data.beneficiaries);
      } else {
        setError(response.data.message || 'Failed to fetch beneficiaries');
        setMockData();
      }
    } catch (error: any) {
      console.error('Error fetching beneficiaries:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch beneficiaries');
      }
      
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const setMockData = () => {
    const mockBeneficiaries: Beneficiary[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        relationship: 'spouse',
        dateOfBirth: '1985-03-15',
        contactInfo: {
          phone: '+1 (555) 123-4567',
          email: 'sarah@example.com'
        },
        createdAt: '2024-01-15T10:00:00',
        isActive: true
      },
      {
        id: '2',
        name: 'Michael Johnson Jr.',
        relationship: 'child',
        dateOfBirth: '2010-06-20',
        contactInfo: {
          phone: '+1 (555) 234-5678',
          email: 'michael.jr@example.com'
        },
        createdAt: '2024-01-15T10:30:00',
        isActive: true
      },
      {
        id: '3',
        name: 'Emily Johnson',
        relationship: 'child',
        dateOfBirth: '2012-11-08',
        contactInfo: {
          phone: '+1 (555) 345-6789'
        },
        createdAt: '2024-01-15T11:00:00',
        isActive: true
      },
      {
        id: '4',
        name: 'Robert Johnson',
        relationship: 'parent',
        dateOfBirth: '1955-09-25',
        contactInfo: {
          phone: '+1 (555) 456-7890',
          email: 'robert@example.com'
        },
        createdAt: '2024-02-01T09:00:00',
        isActive: true
      },
      {
        id: '5',
        name: 'Mary Johnson',
        relationship: 'parent',
        dateOfBirth: '1957-12-10',
        contactInfo: {
          phone: '+1 (555) 567-8901'
        },
        createdAt: '2024-02-01T09:30:00',
        isActive: true
      }
    ];
    setBeneficiaries(mockBeneficiaries);
    setFilteredBeneficiaries(mockBeneficiaries);
  };

  // Handle search
  useEffect(() => {
    const filtered = beneficiaries.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRelationshipLabel(b.relationship).toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactInfo.phone?.includes(searchTerm)
    );
    setFilteredBeneficiaries(filtered);
  }, [searchTerm, beneficiaries]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBeneficiaries();
      toast.success('Beneficiaries refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh beneficiaries');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle add beneficiary
  const handleAddBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (!formData.relationship) {
      toast.error('Please select a relationship');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Please enter date of birth');
      return;
    }

    setSubmitting(true);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.post(
        `${API_URL}/api/member/beneficiaries`,
        {
          ...formData,
          contactInfo: {
            phone: formData.phone,
            email: formData.email
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Beneficiary added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchBeneficiaries();
      } else {
        throw new Error(response.data.message || 'Failed to add beneficiary');
      }
    } catch (error: any) {
      console.error('Error adding beneficiary:', error);
      toast.error(error.response?.data?.message || 'Failed to add beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit beneficiary
  const handleEditBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBeneficiary) return;

    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (!formData.relationship) {
      toast.error('Please select a relationship');
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Please enter date of birth');
      return;
    }

    setSubmitting(true);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.put(
        `${API_URL}/api/member/beneficiaries/${selectedBeneficiary.id}`,
        {
          ...formData,
          contactInfo: {
            phone: formData.phone,
            email: formData.email
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Beneficiary updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchBeneficiaries();
      } else {
        throw new Error(response.data.message || 'Failed to update beneficiary');
      }
    } catch (error: any) {
      console.error('Error updating beneficiary:', error);
      toast.error(error.response?.data?.message || 'Failed to update beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete beneficiary
  const handleDeleteBeneficiary = async () => {
    if (!selectedBeneficiary) return;

    setSubmitting(true);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.delete(
        `${API_URL}/api/member/beneficiaries/${selectedBeneficiary.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
        }
      );

      if (response.data.success) {
        toast.success('Beneficiary deleted successfully!');
        setShowDeleteModal(false);
        setSelectedBeneficiary(null);
        fetchBeneficiaries();
      } else {
        throw new Error(response.data.message || 'Failed to delete beneficiary');
      }
    } catch (error: any) {
      console.error('Error deleting beneficiary:', error);
      toast.error(error.response?.data?.message || 'Failed to delete beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      dateOfBirth: '',
      phone: '',
      email: ''
    });
    setSelectedBeneficiary(null);
  };

  // Open edit modal
  const openEditModal = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData({
      name: beneficiary.name,
      relationship: beneficiary.relationship,
      dateOfBirth: beneficiary.dateOfBirth,
      phone: beneficiary.contactInfo.phone || '',
      email: beneficiary.contactInfo.email || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowDeleteModal(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate age
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Fetch data on mount
  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading beneficiaries...</p>
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
            <div className="flex items-center gap-3">
              <Link to="/member/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  My Beneficiaries
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your family members and dependents
                </p>
              </div>
            </div>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-4 h-4" />
              Add Beneficiary
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchBeneficiaries}
                className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, relationship, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Beneficiaries</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {beneficiaries.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Family Members</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {beneficiaries.filter(b => b.relationship === 'spouse' || b.relationship === 'child' || b.relationship === 'parent').length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {beneficiaries.filter(b => b.isActive !== false).length}
            </p>
          </div>
        </div>

        {/* Beneficiaries Grid */}
        {filteredBeneficiaries.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
            {searchTerm ? (
              <>
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms
                </p>
              </>
            ) : (
              <>
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                  No beneficiaries added yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Add your family members and dependents as beneficiaries
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Beneficiary
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBeneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow dark:border-gray-800 dark:bg-white/[0.03] group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center">
                      {getRelationshipIcon(beneficiary.relationship)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white/90">
                        {beneficiary.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getRelationshipLabel(beneficiary.relationship)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(beneficiary)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(beneficiary)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatDate(beneficiary.dateOfBirth)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ({calculateAge(beneficiary.dateOfBirth)} years old)
                    </span>
                  </div>
                  
                  {beneficiary.contactInfo.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {beneficiary.contactInfo.phone}
                      </span>
                    </div>
                  )}
                  
                  {beneficiary.contactInfo.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">
                        {beneficiary.contactInfo.email}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Added: {new Date(beneficiary.createdAt).toLocaleDateString()}
                  </span>
                  {beneficiary.isActive !== false && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Shield className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Beneficiary Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Add Beneficiary
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddBeneficiary} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Relationship *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">Select relationship...</option>
                    {relationshipOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Beneficiary
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Beneficiary Modal */}
        {showEditModal && selectedBeneficiary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Beneficiary
                  </h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditBeneficiary} className="p-6 space-y-4">
                {/* Same fields as add form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Relationship *
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">Select relationship...</option>
                    {relationshipOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone Number
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Update Beneficiary
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBeneficiary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 text-center mb-2">
                  Delete Beneficiary?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                  Are you sure you want to delete <strong>{selectedBeneficiary.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedBeneficiary(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBeneficiary}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Beneficiaries;