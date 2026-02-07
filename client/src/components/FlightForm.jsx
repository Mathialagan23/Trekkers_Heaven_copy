import { useState, useEffect } from 'react';
import { createFlight, updateFlight } from '../services/flightService';
import '../styles/FormModal.css';

const FlightForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    airline: '',
    departure: {
      airport: '',
      date: '',
      time: ''
    },
    arrival: {
      airport: '',
      date: '',
      time: ''
    },
    price: 0,
    bookingLink: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        airline: item.airline || '',
        departure: {
          airport: item.departure?.airport || '',
          date: item.departure?.date ? new Date(item.departure.date).toISOString().split('T')[0] : '',
          time: item.departure?.time || ''
        },
        arrival: {
          airport: item.arrival?.airport || '',
          date: item.arrival?.date ? new Date(item.arrival.date).toISOString().split('T')[0] : '',
          time: item.arrival?.time || ''
        },
        price: item.price || 0,
        bookingLink: item.bookingLink || '',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('departure.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        departure: { ...formData.departure, [field]: value }
      });
    } else if (name.startsWith('arrival.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        arrival: { ...formData.arrival, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        departure: {
          ...formData.departure,
          date: new Date(formData.departure.date)
        },
        arrival: {
          ...formData.arrival,
          date: new Date(formData.arrival.date)
        },
        price: parseFloat(formData.price) || 0
      };

      if (item) {
        await updateFlight(item._id, data);
        alert('Flight updated');
        const itineraryId = localStorage.getItem('activeItineraryId');
        if (itineraryId) window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId } }));
      } else {
        await createFlight(data);
        alert('Flight added');
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
          <h2>{item ? 'Edit' : 'Add'} Flight</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Airline *</label>
            <input
              type="text"
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-section">
            <h3>Departure</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Airport *</label>
                <input
                  type="text"
                  name="departure.airport"
                  value={formData.departure.airport}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="departure.date"
                  value={formData.departure.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="departure.time"
                  value={formData.departure.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Arrival</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Airport *</label>
                <input
                  type="text"
                  name="arrival.airport"
                  value={formData.arrival.airport}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="arrival.date"
                  value={formData.arrival.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="arrival.time"
                  value={formData.arrival.time}
                  onChange={handleChange}
                  required
                />
              </div>
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

export default FlightForm;

