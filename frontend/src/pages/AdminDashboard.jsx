import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Download, 
  Search, 
  Trash2, 
  TrendingUp, 
  Users, 
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [signatures, setSignatures] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    const expiry = localStorage.getItem('adminTokenExpiry');
    
    if (!token || !expiry || Date.now() > parseInt(expiry)) {
      toast.error('Session expired. Please login again.');
      navigate('/admin833');
      return null;
    }
    
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchStats = async () => {
    try {
      const authConfig = getAuthHeader();
      if (!authConfig) return;
      
      const response = await axios.get(`${API}/admin/stats`, authConfig);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err.response?.status === 401) {
        navigate('/admin833');
      }
    }
  };

  const fetchSignatures = async (page = 1, search = '') => {
    try {
      const authConfig = getAuthHeader();
      if (!authConfig) return;
      
      setLoading(true);
      const response = await axios.get(
        `${API}/admin/signatures?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`,
        authConfig
      );
      
      setSignatures(response.data.signatures);
      setTotalPages(response.data.total_pages);
      setTotal(response.data.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching signatures:', err);
      toast.error('Failed to load signatures');
      if (err.response?.status === 401) {
        navigate('/admin833');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSignatures();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSignatures(1, searchTerm);
  };

  const handleDelete = async (signatureId) => {
    if (!window.confirm('Are you sure you want to delete this signature?')) return;
    
    try {
      const authConfig = getAuthHeader();
      if (!authConfig) return;
      
      await axios.delete(`${API}/admin/signature/${signatureId}`, authConfig);
      toast.success('Signature deleted successfully');
      fetchSignatures(currentPage, searchTerm);
      fetchStats();
    } catch (err) {
      console.error('Error deleting signature:', err);
      toast.error('Failed to delete signature');
    }
  };

  const handleExportCSV = async () => {
    try {
      const authConfig = getAuthHeader();
      if (!authConfig) return;
      
      toast.info('Generating CSV...');
      const response = await axios.get(`${API}/admin/export-csv`, {
        ...authConfig,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `petition_signatures_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      toast.error('Failed to export CSV');
    }
  };

  const handleLogout = async () => {
    try {
      const authConfig = getAuthHeader();
      if (authConfig) {
        await axios.post(`${API}/admin/logout`, {}, authConfig);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminTokenExpiry');
      toast.success('Logged out successfully');
      navigate('/admin833');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">Saaf Hawa - Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Petition Management System</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-black mb-1">{stats.total_signatures.toLocaleString()}</div>
              <div className="text-gray-600 text-sm font-semibold">Total Signatures</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-black mb-1">{stats.today.toLocaleString()}</div>
              <div className="text-gray-600 text-sm font-semibold">Today</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-black mb-1">{stats.this_week.toLocaleString()}</div>
              <div className="text-gray-600 text-sm font-semibold">This Week</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-black mb-1">{stats.this_month.toLocaleString()}</div>
              <div className="text-gray-600 text-sm font-semibold">This Month</div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchSignatures(currentPage, searchTerm);
                  fetchStats();
                }}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Signatures Table */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-black">Petition Signatures ({total.toLocaleString()} total)</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading signatures...</p>
            </div>
          ) : signatures.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No signatures found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {signatures.map((sig) => (
                      <tr key={sig.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          #{sig.signature_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sig.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sig.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(sig.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(sig.id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                            title="Delete signature"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchSignatures(currentPage - 1, searchTerm)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => fetchSignatures(currentPage + 1, searchTerm)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
