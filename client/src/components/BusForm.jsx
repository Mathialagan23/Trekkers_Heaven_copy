import { useState, useEffect } from 'react';
import { createBus, updateBus } from '../services/busService';
import '../styles/FormModal.css';

const BusForm = ({ item, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        company: '',
        departure: { from: '', date: '', time: '' },
        arrival: { to: '', date: '', time: '' },
        price: 0,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({
                company: item.company || '',
                departure: {
                    from: item.departure?.from || '',
                    date: item.departure?.date ? new Date(item.departure.date).toISOString().split('T')[0] : '',
                    time: item.departure?.time || ''
                },
                arrival: {
                    to: item.arrival?.to || '',
                    date: item.arrival?.date ? new Date(item.arrival.date).toISOString().split('T')[0] : '',
                    time: item.arrival?.time || ''
                },
                price: item.price || 0,
                notes: item.notes || ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('departure.')) {
            const field = name.split('.')[1];
            setFormData({ ...formData, departure: { ...formData.departure, [field]: value } });
        } else if (name.startsWith('arrival.')) {
            const field = name.split('.')[1];
            setFormData({ ...formData, arrival: { ...formData.arrival, [field]: value } });
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
                departure: { ...formData.departure, date: new Date(formData.departure.date) },
                arrival: { ...formData.arrival, date: new Date(formData.arrival.date) },
                price: Number(formData.price) || 0
            };

            if (item) await updateBus(item._id, data);
            else await createBus(data);

            const itineraryId = localStorage.getItem('activeItineraryId');
            if (itineraryId) window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId } }));

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
                    <h2>{item ? 'Edit' : 'Add'} Bus</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Company *</label>
                        <input name="company" value={formData.company} onChange={handleChange} required />
                    </div>

                    <div className="form-section">
                        <h3>Departure</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <input type="text" name="departure.from" placeholder="From" value={formData.departure.from} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <input type="date" name="departure.date" value={formData.departure.date} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <input type="time" name="departure.time" value={formData.departure.time} onChange={handleChange} />
                            </div>

                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Arrival</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <input name="arrival.to" placeholder="To" value={formData.arrival.to} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <input type="date" name="arrival.date" value={formData.arrival.date} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <input type="time" name="arrival.time" value={formData.arrival.time} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" />
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : item ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusForm;
