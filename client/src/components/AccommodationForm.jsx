import { useState, useEffect } from 'react';
import { createAccommodation, updateAccommodation } from '../services/accommodationService';
import '../styles/FormModal.css';

const AccommodationForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    checkIn: '',
    checkOut: '',
    price: 0,
    bookingLink: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        location: item.location || '',
        checkIn: item.checkIn ? new Date(item.checkIn).toISOString().split('T')[0] : '',
        checkOut: item.checkOut ? new Date(item.checkOut).toISOString().split('T')[0] : '',
        price: item.price || 0,
        bookingLink: item.bookingLink || '',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        price: parseFloat(formData.price) || 0
      };

      if (item) {
        await updateAccommodation(item._id, data);
        alert('Accommodation updated');
        const itineraryId = localStorage.getItem('activeItineraryId');
        if (itineraryId) window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId } }));
      } else {
        await createAccommodation(data);
        alert('Accommodation added');
        const itineraryId = localStorage.getItem('activeItineraryId');
        if (itineraryId) window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId } }));
      }
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'No active itinerary selected') setError('No active itinerary selected. Please choose one in the Dashboard first.');
      else setError(msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit' : 'Add'} Accommodation</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date *</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Booking Link</label>
            <input
              type="url"
              name="bookingLink"
              value={formData.bookingLink}
              onChange={handleChange}
              placeholder="https://example.com/book"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            />
          </div> 
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : item ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccommodationForm;

