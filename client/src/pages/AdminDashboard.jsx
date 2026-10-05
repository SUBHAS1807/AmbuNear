import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Ambulance,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { formatDateTime } from '../utils/formatters';

export const AdminDashboard = () => {
  const { toastSuccess, toastError } = useToast();

  const [activeTab, setActiveTab] = useState('metrics'); // metrics, users, drivers, ambulances, bookings, audit
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Tab Data States
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    action: null,
    isDestructive: false,
  });

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await api.admin.getMetrics();
      if (res.success && res.data) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      toastError('Failed to load platform metrics.');
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchTabData = async (tab) => {
    setTableLoading(true);
    try {
      if (tab === 'users') {
        const res = await api.admin.getUsers(`?search=${encodeURIComponent(searchQuery)}`);
        if (res.success) setUsers(res.data.users || []);
      } else if (tab === 'drivers') {
        const res = await api.admin.getDrivers();
        if (res.success) setDrivers(res.data.drivers || []);
      } else if (tab === 'ambulances') {
        const res = await api.admin.getAmbulances();
        if (res.success) setAmbulances(res.data.ambulances || []);
      } else if (tab === 'bookings') {
        const res = await api.admin.getBookings();
        if (res.success) setBookings(res.data.bookings || []);
      } else if (tab === 'audit') {
        const res = await api.admin.getAuditLogs();
        if (res.success) setAuditLogs(res.data.logs || []);
      }
    } catch (err) {
      toastError(`Failed to load ${tab} data.`);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (activeTab !== 'metrics') {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  const handleUpdateUserStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'SUSPENDED' ? 'Suspend' : 'Activate'} User Account`,
      message: `Are you sure you want to change this user status to ${nextStatus}?`,
      isDestructive: nextStatus === 'SUSPENDED',
      action: async () => {
        try {
          const res = await api.admin.updateUserStatus(userId, nextStatus);
          if (res.success) {
            toastSuccess(`User status updated to ${nextStatus}`);
            fetchTabData('users');
            fetchMetrics();
          }
        } catch (err) {
          toastError(err.message || 'Action failed.');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleVerifyDriver = async (driverId, status) => {
    try {
      const res = await api.admin.verifyDriver(driverId, status);
      if (res.success) {
        toastSuccess(`Driver verification status updated to ${status}`);
        fetchTabData('drivers');
        fetchMetrics();
      }
    } catch (err) {
      toastError(err.message || 'Verification update failed.');
    }
  };

  const handleVerifyAmbulance = async (ambulanceId, status) => {
    try {
      const res = await api.admin.verifyAmbulance(ambulanceId, status);
      if (res.success) {
        toastSuccess(`Ambulance verification set to ${status}`);
        fetchTabData('ambulances');
        fetchMetrics();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update vehicle verification.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Shield size={28} color="var(--color-primary)" />
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Platform Administrator Portal</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Full fleet governance, driver verification, user management, and live trip audits.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchMetrics();
            if (activeTab !== 'metrics') fetchTabData(activeTab);
          }}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Real Platform Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Registered Patients
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.totalUsers ?? 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Drivers
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.totalDrivers ?? 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Fleet Ambulances
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-emergency)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.totalAmbulances ?? 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Available Ready Units
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-available)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.availableAmbulances ?? 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Dispatches
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-busy)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.activeBookings ?? 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Completed Trips
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {loadingMetrics ? '...' : metrics?.completedBookings ?? 0}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-medium)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { key: 'users', label: 'Users Management' },
          { key: 'drivers', label: 'Driver Approvals' },
          { key: 'ambulances', label: 'Fleet Management' },
          { key: 'bookings', label: 'Trip Bookings' },
          { key: 'audit', label: 'Audit Trail' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn btn-sm"
            style={{
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              padding: '0.65rem 1.25rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content Container */}
      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        {tableLoading ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '40px' }} />
          </div>
        ) : (
          <>
            {/* TAB: USERS */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>Registered Users ({users.length})</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input"
                      style={{ width: '220px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                    />
                    <button onClick={() => fetchTabData('users')} className="btn btn-secondary btn-sm">
                      Filter
                    </button>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{u.email}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{u.phone}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-primary">{u.role}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className={`badge ${u.accountStatus === 'ACTIVE' ? 'badge-available' : 'badge-busy'}`}>
                            {u.accountStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleUpdateUserStatus(u._id, u.accountStatus)}
                              className={`btn btn-sm ${u.accountStatus === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: DRIVERS */}
            {activeTab === 'drivers' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  Driver Verification Applications ({drivers.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Driver Name</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>License Number</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Assigned Ambulance</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Verification</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Decide</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr key={d._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{d.user?.name || 'N/A'}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{d.licenseNumber}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {d.assignedAmbulance?.vehicleNumber || 'Unassigned'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            className={`badge ${
                              d.licenseVerificationStatus === 'VERIFIED'
                                ? 'badge-available'
                                : d.licenseVerificationStatus === 'REJECTED'
                                ? 'badge-emergency'
                                : 'badge-busy'
                            }`}
                          >
                            {d.licenseVerificationStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleVerifyDriver(d._id, 'VERIFIED')}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyDriver(d._id, 'REJECTED')}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-emergency)' }}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: AMBULANCES */}
            {activeTab === 'ambulances' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  Ambulance Fleet ({ambulances.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Vehicle Number</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Driver</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Availability</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Verification</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambulances.map((amb) => (
                      <tr key={amb._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{amb.vehicleNumber}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{amb.ambulanceType.replace(/_/g, ' ')}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{amb.driver?.name || 'Unassigned'}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            className={`badge ${
                              amb.availability === 'AVAILABLE'
                                ? 'badge-available'
                                : amb.availability === 'BUSY'
                                ? 'badge-busy'
                                : 'badge-offline'
                            }`}
                          >
                            {amb.availability}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-primary">{amb.verificationStatus}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <button
                            onClick={() =>
                              handleVerifyAmbulance(
                                amb._id,
                                amb.verificationStatus === 'VERIFIED' ? 'REJECTED' : 'VERIFIED'
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {amb.verificationStatus === 'VERIFIED' ? 'Suspend' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  Platform Emergency Dispatches ({bookings.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Booking #</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Patient</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Pickup</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Destination</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{b.bookingNumber}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{b.patientName}</td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.pickupAddress}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.destinationAddress}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            className={`badge ${
                              b.status === 'COMPLETED'
                                ? 'badge-available'
                                : b.status === 'CANCELLED'
                                ? 'badge-offline'
                                : 'badge-busy'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formatDateTime(b.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>
                  Administrative Audit Trail ({auditLogs.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Admin</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Action</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Entity</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                          {log.adminUser?.name || 'Admin'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-primary">{log.action}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{log.targetEntity}</td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
