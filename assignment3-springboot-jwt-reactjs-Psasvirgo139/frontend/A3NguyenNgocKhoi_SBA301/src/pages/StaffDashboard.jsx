import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('rooms');

  // Rooms Management State
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeID: '',
    roomStatus: 1,
    roomPricePerDay: 50.00
  });
  const [roomAlert, setRoomAlert] = useState({ type: '', text: '' });

  // Customers Management State
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: ''
  });
  const [customerAlert, setCustomerAlert] = useState({ type: '', text: '' });

  // Bookings Management State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingAlert, setBookingAlert] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
    fetchCustomers();
    fetchBookings();
  }, []);

  // API Call Handlers
  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await API.get('/rooms?all=true');
      setRooms(res.data);
    } catch (err) {
      console.error('Error loading rooms', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await API.get('/room-types');
      setRoomTypes(res.data);
      if (res.data.length > 0 && !roomForm.roomTypeID) {
        setRoomForm(prev => ({ ...prev, roomTypeID: res.data[0].roomTypeID }));
      }
    } catch (err) {
      console.error('Error loading room types', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await API.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error loading customers', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error loading bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // ROOM ACTIONS
  const openNewRoomModal = () => {
    setEditingRoom(null);
    setRoomForm({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeID: roomTypes[0]?.roomTypeID || '',
      roomStatus: 1,
      roomPricePerDay: 50.00
    });
    setRoomAlert({ type: '', text: '' });
    setShowRoomModal(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity,
      roomTypeID: room.roomType.roomTypeID,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay
    });
    setRoomAlert({ type: '', text: '' });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setRoomAlert({ type: '', text: '' });
    try {
      if (editingRoom) {
        await API.put(`/rooms/${editingRoom.roomID}`, roomForm);
      } else {
        await API.post('/rooms', roomForm);
      }
      setShowRoomModal(false);
      fetchRooms();
    } catch (err) {
      setRoomAlert({ type: 'error', text: err.response?.data?.error || 'Error saving room' });
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete or change status of this room?')) return;
    try {
      const res = await API.delete(`/rooms/${roomId}`);
      alert(res.data.message);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete room');
    }
  };

  // CUSTOMER ACTIONS
  const openNewCustomerModal = () => {
    setEditingCustomer(null);
    setCustomerForm({
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '',
      customerStatus: 1,
      password: ''
    });
    setCustomerAlert({ type: '', text: '' });
    setShowCustomerModal(true);
  };

  const openEditCustomerModal = (cust) => {
    setEditingCustomer(cust);
    setCustomerForm({
      customerFullName: cust.customerFullName,
      telephone: cust.telephone,
      emailAddress: cust.emailAddress,
      customerBirthday: cust.customerBirthday,
      customerStatus: cust.customerStatus,
      password: ''
    });
    setCustomerAlert({ type: '', text: '' });
    setShowCustomerModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setCustomerAlert({ type: '', text: '' });
    try {
      if (editingCustomer) {
        await API.put(`/customers/${editingCustomer.customerID}`, customerForm);
      } else {
        await API.post('/customers', customerForm);
      }
      setShowCustomerModal(false);
      fetchCustomers();
    } catch (err) {
      setCustomerAlert({ type: 'error', text: err.response?.data?.error || 'Error saving customer' });
    }
  };

  const handleDeactivateCustomer = async (customerId) => {
    if (!window.confirm('Deactivate this customer account?')) return;
    try {
      await API.delete(`/customers/${customerId}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to deactivate customer');
    }
  };

  // BOOKING ACTIONS
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status?status=${newStatus}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update booking status');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px', width: '100%' }}>
      {/* Header & Main Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 className="title-display text-gradient-primary" style={{ fontSize: '32px' }}>
            Staff Administration Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Full management control over Rooms, Customers, and Reservations.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '12px' }}>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('rooms')}
            style={{ border: 'none', background: activeTab === 'rooms' ? 'var(--primary)' : 'transparent', color: activeTab === 'rooms' ? '#fff' : 'var(--text-secondary)' }}
          >
            🛏️ Rooms
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('customers')}
            style={{ border: 'none', background: activeTab === 'customers' ? 'var(--primary)' : 'transparent', color: activeTab === 'customers' ? '#fff' : 'var(--text-secondary)' }}
          >
            👥 Customers
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setActiveTab('bookings')}
            style={{ border: 'none', background: activeTab === 'bookings' ? 'var(--primary)' : 'transparent', color: activeTab === 'bookings' ? '#fff' : 'var(--text-secondary)' }}
          >
            📋 Reservations
          </button>
        </div>
      </div>

      {/* TAB 1: ROOMS MANAGEMENT */}
      {activeTab === 'rooms' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="title-display" style={{ fontSize: '22px' }}>Room Directory</h3>
            <button type="button" className="btn-primary" onClick={openNewRoomModal}>
              ➕ Add New Room
            </button>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 20px' }}>Room #</th>
                  <th style={{ padding: '16px 20px' }}>Type</th>
                  <th style={{ padding: '16px 20px' }}>Capacity</th>
                  <th style={{ padding: '16px 20px' }}>Price/Day</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingRooms ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading rooms...</td>
                  </tr>
                ) : rooms.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No rooms found.</td>
                  </tr>
                ) : (
                  rooms.map(room => (
                    <tr key={room.roomID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700' }}>Room {room.roomNumber}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--primary)' }}>{room.roomType.roomTypeName}</td>
                      <td style={{ padding: '16px 20px' }}>{room.roomMaxCapacity} Guests</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--secondary)' }}>${room.roomPricePerDay.toFixed(2)}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-status ${room.roomStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          {room.roomStatus === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={() => openEditRoomModal(room)}
                          style={{ padding: '6px 12px', fontSize: '13px', marginRight: '8px' }}
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          className="btn-danger" 
                          onClick={() => handleDeleteRoom(room.roomID)}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMERS MANAGEMENT */}
      {activeTab === 'customers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="title-display" style={{ fontSize: '22px' }}>Customer Directory</h3>
            <button type="button" className="btn-primary" onClick={openNewCustomerModal}>
              ➕ Add New Customer
            </button>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px 20px' }}>Name</th>
                  <th style={{ padding: '16px 20px' }}>Email</th>
                  <th style={{ padding: '16px 20px' }}>Telephone</th>
                  <th style={{ padding: '16px 20px' }}>Birthday</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingCustomers ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading customers...</td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No customers found.</td>
                  </tr>
                ) : (
                  customers.map(cust => (
                    <tr key={cust.customerID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{cust.customerFullName}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{cust.emailAddress}</td>
                      <td style={{ padding: '16px 20px' }}>{cust.telephone}</td>
                      <td style={{ padding: '16px 20px' }}>{cust.customerBirthday}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-status ${cust.customerStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          {cust.customerStatus === 1 ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={() => openEditCustomerModal(cust)}
                          style={{ padding: '6px 12px', fontSize: '13px', marginRight: '8px' }}
                        >
                          Edit
                        </button>
                        {cust.customerStatus === 1 && (
                          <button 
                            type="button" 
                            className="btn-danger" 
                            onClick={() => handleDeactivateCustomer(cust.customerID)}
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div>
          <h3 className="title-display" style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'left' }}>System Reservations Ledger</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loadingBookings ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No reservations in database.
              </div>
            ) : (
              bookings.map(res => (
                <div key={res.bookingReservationID} className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginRight: '12px' }}>
                        Reservation #{res.bookingReservationID}
                      </span>
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        Guest: {res.customerFullName} ({res.customerEmail})
                      </span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                        Booked Date: {res.bookingDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`badge-status ${res.bookingStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                        {res.bookingStatus === 1 ? 'CONFIRMED' : 'CANCELLED'}
                      </span>

                      {res.bookingStatus === 1 ? (
                        <button 
                          type="button" 
                          className="btn-danger"
                          onClick={() => handleUpdateBookingStatus(res.bookingReservationID, 0)}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <button 
                          type="button" 
                          className="btn-primary"
                          onClick={() => handleUpdateBookingStatus(res.bookingReservationID, 1)}
                          style={{ padding: '6px 12px', fontSize: '13px' }}
                        >
                          Re-activate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {res.bookingDetails.map((detail, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                          Room {detail.roomNumber} ({detail.roomTypeName})
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Stay: {detail.startDate} to {detail.endDate}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--secondary)', marginTop: '6px' }}>
                          ${detail.actualPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '18px', fontWeight: '700' }}>
                    Total Amount: <span style={{ color: 'var(--accent)' }}>${res.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ROOM MODAL */}
      {showRoomModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '30px', textAlign: 'left' }}>
            <h3 className="title-display" style={{ fontSize: '20px', marginBottom: '20px' }}>
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h3>

            {roomAlert.text && (
              <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '16px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                {roomAlert.text}
              </div>
            )}

            <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Room Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Room Type</label>
                <select 
                  className="form-input" 
                  value={roomForm.roomTypeID}
                  onChange={(e) => setRoomForm({ ...roomForm, roomTypeID: parseInt(e.target.value) })}
                  required
                >
                  {roomTypes.map(t => (
                    <option key={t.roomTypeID} value={t.roomTypeID}>{t.roomTypeName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Max Capacity (Guests)</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-input" 
                  value={roomForm.roomMaxCapacity}
                  onChange={(e) => setRoomForm({ ...roomForm, roomMaxCapacity: parseInt(e.target.value) })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Price Per Day ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  className="form-input" 
                  value={roomForm.roomPricePerDay}
                  onChange={(e) => setRoomForm({ ...roomForm, roomPricePerDay: parseFloat(e.target.value) })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select 
                  className="form-input" 
                  value={roomForm.roomStatus}
                  onChange={(e) => setRoomForm({ ...roomForm, roomStatus: parseInt(e.target.value) })}
                >
                  <option value={1}>1 - Active / Available</option>
                  <option value={0}>0 - Inactive / Disabled</option>
                </select>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={roomForm.roomDetailDescription}
                  onChange={(e) => setRoomForm({ ...roomForm, roomDetailDescription: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRoomModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER MODAL */}
      {showCustomerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '30px', textAlign: 'left' }}>
            <h3 className="title-display" style={{ fontSize: '20px', marginBottom: '20px' }}>
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>

            {customerAlert.text && (
              <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '16px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                {customerAlert.text}
              </div>
            )}

            <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={customerForm.customerFullName}
                  onChange={(e) => setCustomerForm({ ...customerForm, customerFullName: e.target.value })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={customerForm.emailAddress}
                  onChange={(e) => setCustomerForm({ ...customerForm, emailAddress: e.target.value })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Telephone</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  value={customerForm.telephone}
                  onChange={(e) => setCustomerForm({ ...customerForm, telephone: e.target.value })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Birthday</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={customerForm.customerBirthday}
                  onChange={(e) => setCustomerForm({ ...customerForm, customerBirthday: e.target.value })}
                  required 
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select 
                  className="form-input" 
                  value={customerForm.customerStatus}
                  onChange={(e) => setCustomerForm({ ...customerForm, customerStatus: parseInt(e.target.value) })}
                >
                  <option value={1}>1 - Active</option>
                  <option value={0}>0 - Disabled</option>
                </select>
              </div>

              <div>
                <label className="form-label">Password {editingCustomer && '(Leave blank to keep unchanged)'}</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={customerForm.password}
                  onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                  required={!editingCustomer}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCustomerModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
