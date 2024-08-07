import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../auth/AuthContext'; // Assuming you have an AuthContext

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
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
    const { user, logout } = useAuth(); // Fetching the current user and logout function
    const navigate = useNavigate();

    // Fetch events from the API
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            const eventData = response.data;

            const eventWithImageUrls = await Promise.all(eventData.map(async (event) => {
                try {
                    if (event.imageId) {
                        const imgResponse = await axios.get(`http://localhost:8080/api/images/${event.imageId}`, { responseType: 'arraybuffer' });
                        const imgBlob = new Blob([imgResponse.data], { type: imgResponse.headers['content-type'] });
                        const imageUrl = URL.createObjectURL(imgBlob);
                        return { ...event, imageUrl };
                    }
                    return { ...event, imageUrl: 'https://via.placeholder.com/150' };
                } catch (imgErr) {
                    console.error('Error fetching individual image:', imgErr);
                    return { ...event, imageUrl: 'https://via.placeholder.com/150' };
                }
            }));

            setEvents(eventWithImageUrls);
            setFilteredEvents(eventWithImageUrls);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to fetch events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const applyFiltersAndSearch = () => {
            let filtered = [...events];

            if (filters.category) {
                filtered = filtered.filter(event => event.eventCategory.toLowerCase() === filters.category.toLowerCase());
            }

            if (filters.startDate && filters.endDate) {
                filtered = filtered.filter(event =>
                    new Date(event.eventDate) >= new Date(filters.startDate) &&
                    new Date(event.eventDate) <= new Date(filters.endDate)
                );
            }

            if (filters.location) {
                filtered = filtered.filter(event => event.eventLocation.toLowerCase().includes(filters.location.toLowerCase()));
            }

            if (filters.minPrice && filters.maxPrice) {
                filtered = filtered.filter(event =>
                    parseFloat(event.eventPrice) >= parseFloat(filters.minPrice) &&
                    parseFloat(event.eventPrice) <= parseFloat(filters.maxPrice)
                );
            }

            if (searchTerm.trim() !== '') {
                filtered = filtered.filter(event =>
                    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.eventLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredEvents(filtered);
        };

        applyFiltersAndSearch();
    }, [filters, searchTerm, events]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleCreateEvent = () => {
        navigate('/create-event');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAbout = () => {
        navigate('/about');
    };

    const handleContact = () => {
        navigate('/contact');
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleAddToCart = (eventId) => {
        // Implement add to cart logic here
        console.log(`Added event ${eventId} to cart.`);
    };

    const handleAddToFavorites = (eventId) => {
        // Implement add to favorites logic here
        console.log(`Added event ${eventId} to favorites.`);
    };

    const handleAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    const handleApprovalStatus = () => {
        navigate('/admin-dashboard'); // Navigate to the admin dashboard
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className='container py-5'>
            <div className='my-4'>
                <h1 className='text-primary'>Events</h1>
                {user && (
                    <div className='mb-4'>
                        {user.role === 'admin' && (
                            <button className='btn btn-primary me-2' onClick={handleAdminDashboard}>
                                Admin Dashboard
                            </button>
                        )}
                        <button className='btn btn-success me-2' onClick={handleCreateEvent}>
                            Create Event
                        </button>
                        <button className='btn btn-info me-2' onClick={handleHome}>
                            Home
                        </button>
                        <button className='btn btn-secondary me-2' onClick={handleAbout}>
                            About
                        </button>
                        <button className='btn btn-secondary me-2' onClick={handleContact}>
                            Contact
                        </button>
                        <button className='btn btn-danger' onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                <input
                    type='text'
                    className='form-control mb-4'
                    placeholder='Search events...'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className='mb-4'>
                    <h3>Filters</h3>
                    <div className='row'>
                        {['category', 'location'].map(filter => (
                            <div className='col-md-2' key={filter}>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder={filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    name={filter}
                                    value={filters[filter]}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        ))}
                        {['startDate', 'endDate'].map(dateType => (
                            <div className='col-md-2' key={dateType}>
                                <input
                                    type='date'
                                    className='form-control'
                                    name={dateType}
                                    value={filters[dateType]}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        ))}
                        {['minPrice', 'maxPrice'].map(priceType => (
                            <div className='col-md-2' key={priceType}>
                                <input
                                    type='number'
                                    className='form-control'
                                    placeholder={priceType === 'minPrice' ? 'Min Price' : 'Max Price'}
                                    name={priceType}
                                    value={filters[priceType]}
                                    onChange={handleFilterChange}
                                    step='0.01'
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className='row row-cols-1 row-cols-md-2 g-4'>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event.id} className='col'>
                                <div className='card'>
                                    <img
                                        src={event.imageUrl || 'https://via.placeholder.com/150'}
                                        className='card-img-top'
                                        alt={event.eventName}
                                    />
                                    <div className='card-body'>
                                        <h5 className='card-title'>{event.eventName}</h5>
                                        <p className='card-text'><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                                        <p className='card-text'><strong>Location:</strong> {event.eventLocation}</p>
                                        <p className='card-text'><strong>Description:</strong> {event.description}</p>
                                        <p className='card-text'><strong>Category:</strong> {event.eventCategory}</p>
                                        <p className='card-text'>
                                            <strong>Price:</strong> {
                                                isNaN(event.eventPrice) ? 'N/A' : `$${parseFloat(event.eventPrice).toFixed(2)}`
                                            }
                                        </p>
                                        <div className='d-flex'>
                                            <button className='btn btn-warning me-2' onClick={() => handleAddToCart(event.id)}>Add to Cart</button>
                                            <button className='btn btn-info me-2' onClick={() => handleAddToFavorites(event.id)}>Add to Favorites</button>
                                            {user.role === 'admin' && (
                                                <button className='btn btn-primary' onClick={handleApprovalStatus}>Approval Status</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;