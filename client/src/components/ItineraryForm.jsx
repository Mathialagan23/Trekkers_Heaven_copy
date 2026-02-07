import { useState, useEffect } from 'react';
import { createItinerary, updateItinerary } from '../services/itineraryService';
import { setItineraryCurrency, getTempCurrencyForCreate, setTempCurrencyForCreate, clearTempCurrencyForCreate } from '../utils/currency';
import '../styles/FormModal.css';

const ItineraryForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    currency: getTempCurrencyForCreate() || 'INR',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      // pull currency from local storage map (frontend-only persistence)
      let currency = 'INR';
      try {
        currency = localStorage.getItem('itineraryCurrencies_v1') ? JSON.parse(localStorage.getItem('itineraryCurrencies_v1'))[item._id] || 'INR' : 'INR';
      } catch (e) { currency = 'INR'; }

      setFormData({
        title: item.title || '',
        description: item.description || '',
        destination: item.destination || '',
        startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
        endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
        budget: typeof item.budget !== 'undefined' ? item.budget : 0,
        currency,
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

    if (Number(formData.budget) < 0) {
      setError('Budget must be a non-negative number');
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        budget: Number(formData.budget),
        currency: formData.currency,
        flights: item?.flights?.map(f => f._id) || [],
        accommodations: item?.accommodations?.map(a => a._id) || []
      };

      if (item) {
        const updated = await updateItinerary(item._id, data);
        // persist currency locally
        setItineraryCurrency(item._id, formData.currency);
      } else {
        const created = await createItinerary(data);
        // created itinerary id -> persist currency locally
        if (created && created._id) {
          setItineraryCurrency(created._id, formData.currency);
          clearTempCurrencyForCreate();
        }
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit' : 'Create'} Itinerary</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Budget *</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select name="currency" value={formData.currency} onChange={(e) => { handleChange(e); setTempCurrencyForCreate(e.target.value); }}>
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
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
              {loading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryForm;

