// pages/member/PaymentSubmission.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ChevronLeft,
  CreditCard,
  DollarSign,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Image,
  X,
  Check,
  Clock,
  Banknote,
  Wallet,
  Building,
  Smartphone,
  Calendar as CalendarIcon,
  Users,
  ArrowRight,
  Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Types
interface Event {
  id: string;
  name: string;
  amount: number;
  deadline: string;
  description?: string;
  status: 'active' | 'upcoming' | 'ended';
  raisedAmount?: number;
  targetAmount?: number;
  participantCount?: number;
}

interface PaymentSubmissionData {
  eventId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  proofFileUrl?: string;
  notes?: string;
}

const PaymentSubmission: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: 'idle' | 'pending' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Form state
  const [formData, setFormData] = useState<PaymentSubmissionData>({
    eventId: '',
    amount: 0,
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Payment methods
  const paymentMethods = [
    { id: 'cashapp', label: 'Cash App', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'venmo', label: 'Venmo', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'zelle', label: 'Zelle', icon: <Building className="w-5 h-5" /> },
    { id: 'stripe', label: 'Stripe', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'paypal', label: 'PayPal', icon: <Wallet className="w-5 h-5" /> },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: <Banknote className="w-5 h-5" /> },
  ];

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

      const response = await axios.get(`${API_URL}/api/member/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
      });

      if (response.data.success) {
        setEvents(response.data.data.events);
        
        // Auto-select event if passed from dashboard
        const params = new URLSearchParams(location.search);
        const eventId = params.get('eventId');
        if (eventId) {
          const event = response.data.data.events.find((e: Event) => e.id === eventId);
          if (event) {
            setSelectedEventId(event.id);
          }
        }
      } else {
        setError(response.data.message || 'Failed to fetch events');
        setEvents([]);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch events');
      }
      
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


// Upload file first
const uploadProofFile = async (file: File): Promise<string | null> => {
  try {
    setUploadingFile(true);
    const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

    const uploadFormData = new FormData();
    uploadFormData.append('profileImage', file);

    // Use your actual endpoint: /api/upload-proof
    const uploadResponse = await axios.post(
      `${API_URL}/api/upload-proof`, // No '/member' in the path
      uploadFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (uploadResponse.data.success) {
      // Get the imageUrl from the response
      const imageUrl = uploadResponse.data.data.imageUrl;
      
      // If it's a relative path, prepend the API URL
      if (imageUrl.startsWith('/')) {
        return `${API_URL}${imageUrl}`;
      }
      
      return imageUrl;
    } else {
      throw new Error(uploadResponse.data.message || 'Failed to upload file');
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    toast.error(error.response?.data?.message || 'Failed to upload proof file');
    return null;
  } finally {
    setUploadingFile(false);
  }
};

  // Open payment modal for event
  const openPaymentModal = (event: Event) => {
    setSelectedEventId(event.id);
    setFormData({
      eventId: event.id,
      amount: event.amount,
      paymentMethod: '',
      transactionId: '',
      notes: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setSubmissionStatus({ status: 'idle', message: '' });
    setShowPaymentModal(true);
  };

  // Handle file upload (local state only)
  const handleFileUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file (JPEG, PNG, or PDF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Remove file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

// Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.eventId) {
    toast.error('Please select an event');
    return;
  }
  if (!formData.paymentMethod) {
    toast.error('Please select a payment method');
    return;
  }
  if (!formData.transactionId.trim()) {
    toast.error('Please enter a transaction ID or reference');
    return;
  }

  setSubmitting(true);
  setSubmissionStatus({ status: 'pending', message: 'Uploading proof and submitting payment...' });

  try {
    let proofFileUrl = '';

    // Upload proof file if selected
    if (selectedFile) {
      setSubmissionStatus({ status: 'pending', message: 'Uploading proof file...' });
      const uploadedUrl = await uploadProofFile(selectedFile);
      if (uploadedUrl) {
        proofFileUrl = uploadedUrl;
      } else {
        throw new Error('Failed to upload proof file');
      }
    }

    setSubmissionStatus({ status: 'pending', message: 'Submitting payment for verification...' });

    const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';

    const submitData = {
      eventId: formData.eventId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId,
      proofFileUrl: proofFileUrl,
      notes: formData.notes
    };

    // Submit payment - use your actual endpoint
    const response = await axios.post(
      `${API_URL}/api/member/payments/submit`, // This should have '/member' if that's your route
      submitData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      setSubmissionStatus({
        status: 'success',
        message: 'Payment submitted successfully! Your payment is pending verification.'
      });
      toast.success('Payment submitted successfully!');
      
      setTimeout(() => {
        setShowPaymentModal(false);
        setSubmissionStatus({ status: 'idle', message: '' });
        fetchEvents();
      }, 3000);
    } else {
      throw new Error(response.data.message || 'Submission failed');
    }
  } catch (error: any) {
    console.error('Error submitting payment:', error);
    setSubmissionStatus({
      status: 'error',
      message: error.response?.data?.message || 'Failed to submit payment. Please try again.'
    });
    toast.error(error.response?.data?.message || 'Failed to submit payment');
  } finally {
    setSubmitting(false);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        className: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500',
        label: 'Active',
      },
      upcoming: {
        className: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500',
        label: 'Upcoming',
      },
      ended: {
        className: 'bg-gray-50 text-gray-600 dark:bg-gray-500/15 dark:text-gray-500',
        label: 'Ended',
      },
    };

    const config = configs[status as keyof typeof configs] || configs.upcoming;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Get selected event
  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 mx-auto max-w-7xl md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Link to="/member/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Events & Contributions
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View all events and make contributions
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchEvents}
                className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              No events available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new fundraising events
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className={`rounded-2xl border bg-white p-6 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] ${
                  selectedEventId === event.id ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200'
                }`}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white/90 text-lg">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(event.status)}
                      {event.participantCount !== undefined && event.participantCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          {event.participantCount} participants
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                    <span className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {formatCurrency(event.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Deadline</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatDate(event.deadline)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {event.raisedAmount !== undefined && event.targetAmount !== undefined && event.status !== 'ended' && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((event.raisedAmount / event.targetAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((event.raisedAmount / event.targetAmount) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                        <span>Raised: {formatCurrency(event.raisedAmount)}</span>
                        <span>Target: {formatCurrency(event.targetAmount)}</span>
                      </div>
                    </div>
                  )}

                  {event.status === 'ended' && event.raisedAmount !== undefined && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Total Raised: {formatCurrency(event.raisedAmount)}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPaymentModal(event)}
                    disabled={event.status === 'ended'}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      event.status === 'ended'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {event.status === 'ended' ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Ended
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        Contribute Now
                      </>
                    )}
                  </button>
                  
                  <Link
                    to={`/member/events/${event.id}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Make Contribution
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedEvent.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSubmissionStatus({ status: 'idle', message: '' });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Status Message */}
              {submissionStatus.status !== 'idle' && (
                <div className={`mb-6 rounded-xl p-4 ${
                  submissionStatus.status === 'success' 
                    ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
                    : submissionStatus.status === 'pending'
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
                    : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    {submissionStatus.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    {submissionStatus.status === 'pending' && <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {submissionStatus.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    <p className={`text-sm ${
                      submissionStatus.status === 'success' 
                        ? 'text-green-600 dark:text-green-400'
                        : submissionStatus.status === 'pending'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {submissionStatus.message}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Summary */}
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Event</p>
                      <p className="font-medium text-gray-800 dark:text-white/90">{selectedEvent.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                        {formatCurrency(selectedEvent.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {formatDate(selectedEvent.deadline)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      {getStatusBadge(selectedEvent.status)}
                    </div>
                  </div>
                </div>

                {/* Amount (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Contribution Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      readOnly
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 text-gray-800 dark:text-white/90 cursor-not-allowed text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Amount is fixed for this event
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-sm ${
                          formData.paymentMethod === method.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {method.icon}
                        <span className="font-medium">{method.label}</span>
                        {formData.paymentMethod === method.id && (
                          <Check className="w-4 h-4 text-brand-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Transaction ID / Reference *
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                    placeholder="Enter transaction ID or payment reference"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    This helps us verify your payment
                  </p>
                </div>

                {/* Upload Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Upload Proof / Screenshot
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(Optional)</span>
                  </label>
                  
                  {!selectedFile ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                          : 'border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Supports: JPEG, PNG, PDF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      {previewUrl ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white/90 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                  {uploadingFile && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                      <span className="text-sm text-gray-500">Uploading file...</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Additional Notes
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    placeholder="Any additional information about this payment..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || uploadingFile || !formData.paymentMethod || !formData.transactionId}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submitting || uploadingFile ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {uploadingFile ? 'Uploading...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Payment
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  By submitting, you confirm that the payment information provided is accurate.
                  Your submission will be reviewed by the treasurer.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSubmission;