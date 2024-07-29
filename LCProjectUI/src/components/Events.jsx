import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Events.css';
import { useAuth } from '../auth/AuthContext';

const Events = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, [location.key]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      setData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFiltersAndSearch();
  }, [filters, searchTerm, data]);

  const applyFiltersAndSearch = () => {
    let filtered = [...data];
    // Apply filters and search term logic here
    // Example logic:
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Apply additional filters
    setFilteredData(filtered);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: '',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
  };

  const fetchAndUpdateApprovalStatus = (eventId) => {
    console.log(`Update approval status for event ID: ${eventId}`);
  };

  const base64ToImageUrl = (base64String, mimeType) => {
    if (!base64String) return '';
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from AuthContext
      navigate('/'); // Redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='container py-5'>
      <div className='card shadow-sm'>
        <div className='card-body'>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Loading...</div>}
          {!loading && !data.length && !error && <div className="alert alert-info">No events found.</div>}

          <div className='mb-3 d-flex justify-content-between align-items-center'>
            <h1 className='text-primary'>Event Finder</h1>
            <div>
              {user?.role === 'admin' && (
                <button
                  className='btn btn-outline-secondary me-2'
                  onClick={() => navigate('/admin-dashboard')}
                >
                  Admin Dashboard
                </button>
              )}
              <button className='btn btn-outline-primary me-2' onClick={() => navigate('/create-event')}>Create Event</button>
              <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <input
            type='text'
            className='form-control mb-3'
            placeholder='Search events...'
            value={searchTerm}
            onChange={handleSearch}
          />

          <div className='row mb-3'>
            {/* Filters inputs */}
            {/* Add filter inputs and handle their changes */}
          </div>

          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {filteredData.map((event, index) => (
              <div key={index} className='col'>
                <div className='card'>
                  <img
                    src={base64ToImageUrl(event.eventImage, event.imageMimeType)}
                    className='card-img-top'
                    alt={event.eventName}
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>{event.eventName}</h5>
                    <p className='card-text'><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                    <p className='card-text'><strong>Time:</strong> {event.eventTime}</p>
                    <p className='card-text'><strong>Location:</strong> {event.eventLocation}</p>
                    <p className='card-text'><strong>Description:</strong> {event.description}</p>
                    <p className='card-text'><strong>Category:</strong> {event.eventCategory}</p>
                    <p className='card-text'><strong>Price:</strong> ${event.eventPrice.toFixed(2)}</p>
                    <p className='card-text'><strong>Approval Status:</strong> {event.approvalStatus}</p>
                    <button className='btn btn-primary' onClick={() => fetchAndUpdateApprovalStatus(event.id)}>Approve Event</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-3'>
            <button className='btn btn-secondary' onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
