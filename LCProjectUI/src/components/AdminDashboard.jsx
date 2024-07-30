import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AdminDashboard.css'; // Adjust as needed

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
        // Optionally, redirect or show a message if unauthorized
      }
    };
    fetchData();
  }, []);

  const filterEvents = (status) => {
    let filteredEvents = events;
    if (status !== 'All') {
      filteredEvents = events.filter(event => event.approvalStatus === status);
    }
    setFilteredEvents(filteredEvents);
    setFilter(status);
  };

  const toggleEditPopup = (event) => {
    setShowEditPopup(!showEditPopup);
    setEditEvent(event);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditEvent(prevState => ({ ...prevState, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      await axios.put(`http://localhost:8080/api/admin/events/${editEvent.id}`, JSON.stringify(editEvent), {
        headers: { 'Content-Type': 'application/json' }
      });
      toggleEditPopup(null);
      fetchData(); // Refresh the event list
    } catch (error) {
      console.error('Error updating the event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/events/${eventId}`);
      fetchData(); // Refresh the event list
    } catch (error) {
      console.error('Error deleting the event:', error);
    }
  };

  const formatTime = (timeArray) => {
    if (!Array.isArray(timeArray) || timeArray.length !== 2) return '';
    const [hours, minutes] = timeArray;
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };

  return (
    <div className='container-fluid'>
      <header className='bg-light text-primary p-4 mb-4'>
        <h1 className='text-center'>Admin Dashboard</h1>
        <button className='btn btn-secondary' onClick={() => navigate('/events')}>Back</button> {/* Back button */}
      </header>
      <div className='row'>
        <aside className='col-md-3 mb-3'>
          <div className='list-group'>
            <button className={`list-group-item list-group-item-action ${filter === 'All' ? 'active' : ''}`} onClick={() => filterEvents('All')}>All</button>
            <button className={`list-group-item list-group-item-action ${filter === 'Approved' ? 'active' : ''}`} onClick={() => filterEvents('Approved')}>Approved</button>
            <button className={`list-group-item list-group-item-action ${filter === 'Pending' ? 'active' : ''}`} onClick={() => filterEvents('Pending')}>Pending</button>
            <button className={`list-group-item list-group-item-action ${filter === 'Rejected' ? 'active' : ''}`} onClick={() => filterEvents('Rejected')}>Rejected</button>
          </div>
        </aside>
        <main className='col-md-9'>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Description</th>
                <th>Event Category</th>
                <th>Event Date</th>
                <th>Event Time</th>
                <th>Event Location</th>
                <th>Event Price</th>
                <th>Approval Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.eventName}</td>
                  <td>{event.description}</td>
                  <td>{event.eventCategory}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td>{formatTime(event.eventTime)}</td>
                  <td>{event.eventLocation}</td>
                  <td>${event.eventPrice.toFixed(2)}</td>
                  <td>{event.approvalStatus}</td>
                  <td>
                    <div className='d-flex'>
                      <button className='btn btn-warning btn-sm me-2' onClick={() => toggleEditPopup(event)}>Edit</button>
                      <button className='btn btn-danger btn-sm' onClick={() => deleteEvent(event.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      {showEditPopup && (
        <div className='modal show d-block' tabIndex='-1' role='dialog'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Edit Event</h5>
                <button type='button' className='btn-close' onClick={() => toggleEditPopup(null)}></button>
              </div>
              <div className='modal-body'>
                {editEvent && (
                  <form>
                    <div className='mb-3'>
                      <label className='form-label'>ID: {editEvent.id}</label>
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Event Name</label>
                      <input type='text' className='form-control' name='eventName' value={editEvent.eventName} onChange={handleInputChange} />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Description</label>
                      <input type='text' className='form-control' name='description' value={editEvent.description} onChange={handleInputChange} />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Event Category</label>
                      <input type='text' className='form-control' name='eventCategory' value={editEvent.eventCategory} onChange={handleInputChange} />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Event Date and Time</label>
                      <input
                        type='datetime-local'
                        className='form-control'
                        name='eventDate'
                        value={formatDateTime(editEvent.eventDate)}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Event Location</label>
                      <input type='text' className='form-control' name='eventLocation' value={editEvent.eventLocation} onChange={handleInputChange} />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Event Price</label>
                      <input type='number' className='form-control' name='eventPrice' value={editEvent.eventPrice} onChange={handleInputChange} />
                    </div>
                    <div className='mb-3'>
                      <label className='form-label'>Approval Status</label>
                      <select className='form-select' name='approvalStatus' value={editEvent.approvalStatus} onChange={handleInputChange}>
                        <option value='Approved'>Approved</option>
                        <option value='Pending'>Pending</option>
                        <option value='Rejected'>Rejected</option>
                      </select>
                    </div>
                    <div className='mb-3'>
                      <button type='button' className='btn btn-primary' onClick={saveChanges}>Save Changes</button>
                      <button type='button' className='btn btn-secondary ms-2' onClick={() => toggleEditPopup(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;