import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';

export default function CustomerDashboard() {
  const [searchParams] = useSearchParams();
  const initialRoomId = searchParams.get('bookRoomId');

  const [activeTab, setActiveTab] = useState(initialRoomId ? 'new-booking' : 'history');
  
  // Profile state
  const [profile, setProfile] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Bookings History state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // New Booking state
  const [rooms, setRooms] = useState([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState(initialRoomId ? [parseInt(initialRoomId)] : []);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Tomorrow default for endDate
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [endDate, setEndDate] = useState(tomorrow.toISOString().split('T')[0]);
  
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/customers/profile');
      setProfile({
        customerFullName: res.data.customerFullName || '',
        telephone: res.data.telephone || '',
        emailAddress: res.data.emailAddress || '',
        customerBirthday: res.data.customerBirthday || '',
        password: ''
      });
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await API.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Error fetching rooms', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    try {
      const res = await API.put('/customers/profile', {
        customerFullName: profile.customerFullName,
        telephone: profile.telephone,
        customerBirthday: profile.customerBirthday,
        password: profile.password || null
      });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update local storage name if changed
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localUser.fullName = res.data.customerFullName;
      localStorage.setItem('user', JSON.stringify(localUser));
    } catch (err) {
      setProfileMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    }
  };

  const handleRoomToggle = (roomId) => {
    setSelectedRoomIds(prev => 
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  // Calculate days & total price
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (days <= 0) return 0;

    let total = 0;
    selectedRoomIds.forEach(id => {
      const room = rooms.find(r => r.roomID === id);
      if (room) {
        total += room.roomPricePerDay * days;
      }
    });
    return total;
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingMessage({ type: '', text: '' });

    if (selectedRoomIds.length === 0) {
      setBookingMessage({ type: 'error', text: 'Please select at least one room to book.' });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setBookingMessage({ type: 'error', text: 'End date must be strictly after start date.' });
      return;
    }

    setSubmittingBooking(true);
    try {
      await API.post('/bookings', {
        startDate,
        endDate,
        roomIDs: selectedRoomIds
      });

      setBookingMessage({ type: 'success', text: 'Reservation completed successfully!' });
      setSelectedRoomIds([]);
      fetchBookings(); // refresh history
      setTimeout(() => {
        setActiveTab('history');
        setBookingMessage({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      setBookingMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create reservation.' });
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/status?status=0`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel reservation');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', width: '100%' }}>
      {/* Header & Nav Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 className="title-display text-gradient-primary" style={{ fontSize: '32px' }}>
            Customer Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and room reservations.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '12px' }}>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('history')}
            style={{ border: 'none', background: activeTab === 'history' ? 'var(--primary)' : 'transparent', color: activeTab === 'history' ? '#fff' : 'var(--text-secondary)' }}
          >
            Reservation History
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('new-booking')}
            style={{ border: 'none', background: activeTab === 'new-booking' ? 'var(--primary)' : 'transparent', color: activeTab === 'new-booking' ? '#fff' : 'var(--text-secondary)' }}
          >
            ➕ Book Rooms
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('profile')}
            style={{ border: 'none', background: activeTab === 'profile' ? 'var(--primary)' : 'transparent', color: activeTab === 'profile' ? '#fff' : 'var(--text-secondary)' }}
          >
            👤 Profile
          </button>
        </div>
      </div>

      {/* TAB 1: BOOKING HISTORY */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 className="title-display" style={{ fontSize: '22px', textAlign: 'left' }}>Your Reservation History</h3>
          
          {loadingBookings ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading history...</div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No reservation history found. Click "Book Rooms" to make your first reservation!
            </div>
          ) : (
            bookings.map(res => (
              <div key={res.bookingReservationID} className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', pb: '12px' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginRight: '12px' }}>
                      Reservation #{res.bookingReservationID}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      Booked on: {res.bookingDate}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className={`badge-status ${res.bookingStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                      {res.bookingStatus === 1 ? 'CONFIRMED' : 'CANCELLED'}
                    </span>
                    {res.bookingStatus === 1 && (
                      <button 
                        type="button" 
                        className="btn-danger" 
                        onClick={() => handleCancelBooking(res.bookingReservationID)}
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  {res.bookingDetails.map((detail, idx) => (
                    <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>
                        Room {detail.roomNumber} ({detail.roomTypeName})
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Dates: {detail.startDate} to {detail.endDate}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--secondary)', marginTop: '6px' }}>
                        ${detail.actualPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: '700' }}>
                  Total Paid: <span style={{ color: 'var(--accent)' }}>${res.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: NEW BOOKING */}
      {activeTab === 'new-booking' && (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <h3 className="title-display" style={{ fontSize: '22px', marginBottom: '20px' }}>Create Online Reservation</h3>

          {bookingMessage.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              background: bookingMessage.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${bookingMessage.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              color: bookingMessage.type === 'error' ? '#f87171' : '#34d399'
            }}>
              {bookingMessage.type === 'error' ? '⚠️ ' : '✅ '}{bookingMessage.text}
            </div>
          )}

          <form onSubmit={handleCreateBooking}>
            {/* Date Pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label className="form-label">Check-in Date (Start)</label>
                <input 
                  type="date" 
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Check-out Date (End)</label>
                <input 
                  type="date" 
                  className="form-input"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Room Multi-Selection */}
            <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Select Rooms (Click cards to select/deselect):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {rooms.filter(r => r.roomStatus === 1).map(room => {
                const isSelected = selectedRoomIds.includes(room.roomID);
                return (
                  <div 
                    key={room.roomID}
                    onClick={() => handleRoomToggle(room.roomID)}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '18px' }}>Room {room.roomNumber}</span>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}} // handled by parent div
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                    </div>
                    <div style={{ color: 'var(--primary)', fontSize: '13px', margin: '4px 0' }}>
                      {room.roomType.roomTypeName}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Max {room.roomMaxCapacity} Guests
                    </div>
                    <div style={{ marginTop: '10px', fontWeight: '700', color: 'var(--secondary)' }}>
                      ${room.roomPricePerDay.toFixed(2)} / day
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary banner */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>SELECTED ROOMS: {selectedRoomIds.length}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  DURATION: {Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)))} Days
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ESTIMATED TOTAL</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)' }}>
                  ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
              disabled={submittingBooking || selectedRoomIds.length === 0}
            >
              {submittingBooking ? 'Processing Reservation...' : 'Confirm & Reserve Rooms'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PROFILE */}
      {activeTab === 'profile' && (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          <h3 className="title-display" style={{ fontSize: '22px', marginBottom: '20px' }}>Manage Profile</h3>

          {profileMessage.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              background: profileMessage.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${profileMessage.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              color: profileMessage.type === 'error' ? '#f87171' : '#34d399'
            }}>
              {profileMessage.type === 'error' ? '⚠️ ' : '✅ '}{profileMessage.text}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Email Address (Read-only)</label>
              <input 
                type="email" 
                className="form-input" 
                value={profile.emailAddress} 
                disabled 
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
            <div>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={profile.customerFullName}
                onChange={(e) => setProfile({ ...profile, customerFullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Telephone</label>
              <input 
                type="tel" 
                className="form-input" 
                value={profile.telephone}
                onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">Birthday</label>
              <input 
                type="date" 
                className="form-input" 
                value={profile.customerBirthday}
                onChange={(e) => setProfile({ ...profile, customerBirthday: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="form-label">New Password (Leave blank to keep unchanged)</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Optional new password" 
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
