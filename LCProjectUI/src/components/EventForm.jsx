import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventPrice: '',
    eventCategory: '',
    zipCode: '',
    file: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prevData => ({ ...prevData, file: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'file' && formData[key]) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:8080/api/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Event created successfully!');
      setError('');
      setFormData({
        eventName: '',
        description: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventPrice: '',
        eventCategory: '',
        zipCode: '',
        file: null,
      });
      setImagePreview('');
    } catch (err) {
      console.error('Error creating event:', err);
      setError(`Failed to create event. Please try again. Error: ${err.response?.data?.message || err.message}`);
      setSuccessMessage('');
    }
  };

  return (
    <div className='container py-5'>
      <h1>Create Event</h1>
      <button className='btn btn-secondary mb-3' onClick={() => navigate('/events')}>
        Back to Events
      </button>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className='mb-3'>
          <label htmlFor='eventName' className='form-label'>Event Name</label>
          <input
            type='text'
            id='eventName'
            name='eventName'
            className='form-control'
            value={formData.eventName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className='mb-3'>
          <label htmlFor='description' className='form-label'>Description</label>
          <textarea
            id='description'
            name='description'
            className='form-control'
            value={formData.description}
            onChange={handleChange}
            rows='3'
            required
          />
        </div>

        {/* Event Date */}
        <div className='mb-3'>
          <label htmlFor='eventDate' className='form-label'>Event Date</label>
          <input
            type='date'
            id='eventDate'
            name='eventDate'
            className='form-control'
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Time */}
        <div className='mb-3'>
          <label htmlFor='eventTime' className='form-label'>Event Time</label>
          <input
            type='time'
            id='eventTime'
            name='eventTime'
            className='form-control'
            value={formData.eventTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Location */}
        <div className='mb-3'>
          <label htmlFor='eventLocation' className='form-label'>Event Location</label>
          <input
            type='text'
            id='eventLocation'
            name='eventLocation'
            className='form-control'
            value={formData.eventLocation}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Price */}
        <div className='mb-3'>
          <label htmlFor='eventPrice' className='form-label'>Event Price</label>
          <input
            type='number'
            id='eventPrice'
            name='eventPrice'
            className='form-control'
            value={formData.eventPrice}
            onChange={handleChange}
            step='0.01'
            required
          />
        </div>

        {/* Event Category */}
        <div className='mb-3'>
          <label htmlFor='eventCategory' className='form-label'>Event Category</label>
          <input
            type='text'
            id='eventCategory'
            name='eventCategory'
            className='form-control'
            value={formData.eventCategory}
            onChange={handleChange}
            required
          />
        </div>

        {/* Zip Code */}
        <div className='mb-3'>
          <label htmlFor='zipCode' className='form-label'>Zip Code</label>
          <input
            type='text'
            id='zipCode'
            name='zipCode'
            className='form-control'
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Image */}
        <div className='mb-3'>
          <label htmlFor='file' className='form-label'>Event Image</label>
          <input
            type='file'
            id='file'
            name='file'
            className='form-control'
            onChange={handleChange}
          />
          {imagePreview && (
            <div className='mt-3'>
              <img src={imagePreview} alt='Preview' className='img-fluid' style={{ maxWidth: '300px' }} />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type='submit' className='btn btn-primary'>Create Event</button>
      </form>
      {error && <div className='alert alert-danger mt-3'>{error}</div>}
      {successMessage && <div className='alert alert-success mt-3'>{successMessage}</div>}
    </div>
  );
};

export default EventForm;
