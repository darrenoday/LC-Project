import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AdminDashboard.css'; // Adjust as needed

class AdminDashboard extends Component {
  state = {
    events: [],
    filteredEvents: [],
    filter: 'All',
    showEditPopup: false,
    editEvent: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/events');
      this.setState({ events: response.data, filteredEvents: response.data });
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  filterEvents = (status) => {
    const { events } = this.state;
    let filteredEvents = events;
    if (status !== 'All') {
      filteredEvents = events.filter(event => event.approvalStatus === status);
    }
    this.setState({ filteredEvents, filter: status });
  };

  toggleEditPopup = (event) => {
    this.setState({ showEditPopup: !this.state.showEditPopup, editEvent: event });
  };

  handleInputChange = (e) => {
    const { editEvent } = this.state;
    const { name, value } = e.target;
    this.setState({ editEvent: { ...editEvent, [name]: value } });
  };

  saveChanges = async () => {
    const { editEvent } = this.state;
  
    try {
      await axios.put(`http://localhost:8080/api/admin/events/${editEvent.id}`, JSON.stringify(editEvent), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.toggleEditPopup(null);
      this.fetchData(); // Refresh the event list
    } catch (error) {
      console.error('Error updating the event:', error);
    }
  };

  deleteEvent = async (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/events/${eventId}`);
      this.fetchData(); // Refresh the event list
    } catch (error) {
      console.error('Error deleting the event:', error);
    }
  };

  formatTime = (timeArray) => {
    try {
      if (!Array.isArray(timeArray) || timeArray.length !== 2) {
        return '';
      }
      const [hours, minutes] = timeArray;
      const time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  formatDateTime = (dateTime) => {
    try {
      const date = new Date(dateTime);
      return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
    } catch (error) {
      console.error('Error formatting date and time:', error);
      return '';
    }
  };

  render() {
    const { filteredEvents, filter, showEditPopup, editEvent } = this.state;

    return (
      <div className='container-fluid'>
        <header className='bg-light text-primary p-4 mb-4'>
          <h1 className='text-center'>Admin Dashboard</h1>
        </header>
        <div className='row'>
          <aside className='col-md-3 mb-3'>
            <div className='list-group'>
              <button className={`list-group-item list-group-item-action ${filter === 'All' ? 'active' : ''}`} onClick={() => this.filterEvents('All')}>All</button>
              <button className={`list-group-item list-group-item-action ${filter === 'Approved' ? 'active' : ''}`} onClick={() => this.filterEvents('Approved')}>Approved</button>
              <button className={`list-group-item list-group-item-action ${filter === 'Pending' ? 'active' : ''}`} onClick={() => this.filterEvents('Pending')}>Pending</button>
              <button className={`list-group-item list-group-item-action ${filter === 'Rejected' ? 'active' : ''}`} onClick={() => this.filterEvents('Rejected')}>Rejected</button>
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
                    <td>{this.formatTime(event.eventTime)}</td>
                    <td>{event.eventLocation}</td>
                    <td>${event.eventPrice.toFixed(2)}</td>
                    <td>{event.approvalStatus}</td>
                    <td>
                      <div className='d-flex'>
                        <button className='btn btn-warning btn-sm me-2' onClick={() => this.toggleEditPopup(event)}>Edit</button>
                        <button className='btn btn-danger btn-sm' onClick={() => this.deleteEvent(event.id)}>Delete</button>
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
                  <button type='button' className='btn-close' onClick={() => this.toggleEditPopup(null)}></button>
                </div>
                <div className='modal-body'>
                  {editEvent && (
                    <form>
                      <div className='mb-3'>
                        <label className='form-label'>ID: {editEvent.id}</label>
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Event Name</label>
                        <input type='text' className='form-control' name='eventName' value={editEvent.eventName} onChange={this.handleInputChange} />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Description</label>
                        <input type='text' className='form-control' name='description' value={editEvent.description} onChange={this.handleInputChange} />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Event Category</label>
                        <input type='text' className='form-control' name='eventCategory' value={editEvent.eventCategory} onChange={this.handleInputChange} />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Event Date and Time</label>
                        <input
                          type='datetime-local'
                          className='form-control'
                          name='eventDate'
                          value={this.formatDateTime(editEvent.eventDate)}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Event Location</label>
                        <input type='text' className='form-control' name='eventLocation' value={editEvent.eventLocation} onChange={this.handleInputChange} />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Event Price</label>
                        <input type='number' className='form-control' name='eventPrice' value={editEvent.eventPrice} onChange={this.handleInputChange} />
                      </div>
                      <div className='mb-3'>
                        <label className='form-label'>Approval Status</label>
                        <select className='form-select' name='approvalStatus' value={editEvent.approvalStatus} onChange={this.handleInputChange}>
                          <option value='Approved'>Approved</option>
                          <option value='Pending'>Pending</option>
                          <option value='Rejected'>Rejected</option>
                        </select>
                      </div>
                      <button type='button' className='btn btn-primary' onClick={this.saveChanges}>Save</button>
                      <button type='button' className='btn btn-secondary ms-2' onClick={() => this.toggleEditPopup(null)}>Cancel</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AdminDashboard;
