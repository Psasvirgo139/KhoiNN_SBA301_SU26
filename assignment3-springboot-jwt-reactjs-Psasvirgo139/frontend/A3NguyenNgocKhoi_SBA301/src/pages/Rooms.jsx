import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minCapacity, setMinCapacity] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomsAndTypes();
  }, []);

  const fetchRoomsAndTypes = async () => {
    try {
      setLoading(true);
      const [roomsRes, typesRes] = await Promise.all([
        API.get('/rooms'),
        API.get('/room-types')
      ]);
      setRooms(roomsRes.data);
      setRoomTypes(typesRes.data);
    } catch (err) {
      setError('Could not retrieve room records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (roomId) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      navigate('/login');
    } else if (user.role === 'STAFF' || user.role === 'ROLE_STAFF') {
      navigate('/staff');
    } else {
      navigate(`/customer?bookRoomId=${roomId}`);
    }
  };

  // Filter rooms client-side for immediate responsive experience
  const filteredRooms = rooms.filter(room => {
    const matchesNumber = room.roomNumber.toLowerCase().includes(searchNumber.toLowerCase());
    const matchesType = selectedType === '' || room.roomType.roomTypeID.toString() === selectedType;
    const matchesCapacity = minCapacity === '' || room.roomMaxCapacity >= parseInt(minCapacity);
    return matchesNumber && matchesType && matchesCapacity;
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="title-display text-gradient-primary" style={{ fontSize: '48px', marginBottom: '10px' }}>
          Explore Our Rooms
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
          Find and book the perfect room for your comfortable stay. No hidden charges.
        </p>
      </header>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label className="form-label">Search Room Number</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. 101" 
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label className="form-label">Room Type</label>
          <select 
            className="form-input" 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
          >
            <option value="">All Types</option>
            {roomTypes.map(type => (
              <option key={type.roomTypeID} value={type.roomTypeID}>{type.roomTypeName}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label className="form-label">Minimum Capacity (Guests)</label>
          <input 
            type="number" 
            min="1" 
            className="form-input" 
            placeholder="e.g. 2" 
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
          />
        </div>
        <div>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => { setSearchNumber(''); setSelectedType(''); setMinCapacity(''); }}
            style={{ height: '47px', width: '120px' }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Loading rooms... Please wait.
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#f87171' }}>
          {error}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No rooms match your filters. Try adjusting them.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {filteredRooms.map(room => (
            <div key={room.roomID} className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="title-display" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  Room {room.roomNumber}
                </span>
                <span className={`badge-status ${room.roomStatus === 1 ? 'badge-active' : 'badge-inactive'}`}>
                  {room.roomStatus === 1 ? 'Available' : 'Maintenance'}
                </span>
              </div>

              <h4 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '15px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {room.roomType.roomTypeName}
              </h4>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flex: '1', marginBottom: '20px' }}>
                {room.roomDetailDescription || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CAPACITY</div>
                  <div style={{ fontWeight: '500', fontSize: '15px' }}>{room.roomMaxCapacity} {room.roomMaxCapacity > 1 ? 'Guests' : 'Guest'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PRICE PER DAY</div>
                  <div style={{ fontWeight: '700', fontSize: '20px', color: 'var(--secondary)' }}>${room.roomPricePerDay.toFixed(2)}</div>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => handleBookClick(room.roomID)}
                style={{ width: '100%', marginTop: '20px' }}
                disabled={room.roomStatus !== 1}
              >
                {room.roomStatus === 1 ? 'Book Room' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
