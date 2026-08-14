// pages/treasurer/Reports.tsx
import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  Loader2,
  ChevronDown,
  Mail,
  File,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

type ReportType = 'contributions' | 'dues' | 'payouts' | 'reconciliation';

interface ReportData {
  id: string;
  date: string;
  member: string;
  amount: number;
  type: string;
  status: string;
  reference?: string;
  paymentMethod?: string;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('contributions');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<ReportData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [reportSummary, setReportSummary] = useState({ totalRecords: 0, totalAmount: 0 });

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const reportTypes = [
    { id: 'contributions', label: 'Contributions', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'dues', label: 'Dues', icon: <FileText className="w-4 h-4" /> },
    { id: 'payouts', label: 'Payouts', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'reconciliation', label: 'Reconciliation', icon: <File className="w-4 h-4" /> },
  ];

  // Generate Report
  const handleGenerateReport = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setShowExportOptions(false);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      const response = await axios.get(`${API_URL}/api/treasurer/reports/${reportType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Tenant-Subdomain': tenantSubdomain,
        },
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end
        }
      });

      if (response.data.success) {
        setPreviewData(response.data.data.records || []);
        setReportSummary({
          totalRecords: response.data.data.totalRecords || 0,
          totalAmount: response.data.data.totalAmount || 0
        });
        setShowPreview(true);
        toast.success('Report generated successfully');
      } else {
        toast.error(response.data.message || 'Failed to generate report');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Export Report
  const handleExport = async (format: 'excel' | 'csv') => {
    if (previewData.length === 0) {
      toast.error('No data to export. Please generate a report first.');
      return;
    }

    setExporting(true);
    setShowExportOptions(false);

    try {
      const tenantSubdomain = localStorage.getItem('tenantSubdomain') || '';
      
      const response = await axios.post(
        `${API_URL}/api/treasurer/reports/export`,
        {
          reportType,
          startDate: dateRange.start,
          endDate: dateRange.end,
          format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Tenant-Subdomain': tenantSubdomain,
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'excel' ? 'xlsx' : 'csv';
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error('Error exporting report:', error);
      toast.error(error.response?.data?.message || `Failed to export as ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate and export reports in multiple formats
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDateRange({ start: '', end: '' });
              setShowPreview(false);
              setPreviewData([]);
              setReportSummary({ totalRecords: 0, totalAmount: 0 });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 appearance-none"
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={loading || !dateRange.start || !dateRange.end}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileBarChart className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {showPreview && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Report Preview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {reportSummary.totalRecords} records found
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  disabled={previewData.length === 0 || exporting}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Export'
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showExportOptions && !exporting && (
                  <div className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-10 dark:border-gray-700 dark:bg-gray-900">
                    <button
                      onClick={() => handleExport('excel')}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-700"
                    >
                      <File className="w-4 h-4 text-blue-500" />
                      Export as CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {previewData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No records found for the selected date range.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {previewData.map((row, index) => (
                      <tr key={row.id || index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {row.date}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                          {row.member}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">
                          {formatCurrency(row.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.type === 'Contribution' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' :
                            row.type === 'Dues' ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' :
                            'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.status === 'Completed'
                              ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500'
                              : row.status === 'Pending'
                              ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500'
                              : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                          }`}>
                            {row.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                            {row.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {row.reference || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {row.paymentMethod || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Total Records:</span> {reportSummary.totalRecords} &nbsp;|&nbsp;
                  <span className="font-medium">Total Amount:</span> {formatCurrency(reportSummary.totalAmount)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleExport('excel')}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <File className="w-4 h-4 text-blue-500" />
                    CSV
                  </button>
                  <button
                    onClick={() => {
                      const subject = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
                      const body = `Report Type: ${reportType}\nDate Range: ${dateRange.start} to ${dateRange.end}\nTotal Records: ${reportSummary.totalRecords}\nTotal Amount: ${formatCurrency(reportSummary.totalAmount)}`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Report
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* No Data State */}
      {!showPreview && !loading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
              <FileBarChart className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                No Report Generated
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Select a report type and date range, then click "Generate Report" to view data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;