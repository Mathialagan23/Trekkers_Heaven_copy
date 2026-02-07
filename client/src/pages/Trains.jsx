import { useState, useEffect } from 'react';
import { FaTrain } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { getTrains, createTrain } from '../services/trainService';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';
import { getItineraries } from '../services/itineraryService';

const Trains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ operator: '', from: '', to: '', departureDate: '', departureTime: '', arrivalDate: '', arrivalTime: '', price: '', notes: '' });
  const activeItineraryId = localStorage.getItem('activeItineraryId');
  const currency = activeItineraryId ? getItineraryCurrency(activeItineraryId) : 'USD';

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTrains();
      setTrains(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeItineraryId) return alert('Select an active itinerary before adding a train journey');
    try {
      const payload = {
        operator: form.operator,
        departure: { from: form.from, date: form.departureDate, time: form.departureTime },
        arrival: { to: form.to, date: form.arrivalDate, time: form.arrivalTime },
        price: Number(form.price) || 0,
        notes: form.notes
      };
      const res = await createTrain(payload);
      if (res && res.totals) {
        window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId: activeItineraryId, totals: res.totals } }));
      }
      setForm({ operator: '', from: '', to: '', departureDate: '', departureTime: '', arrivalDate: '', arrivalTime: '', price: '', notes: '' });
      setShowForm(false);
      await load();
      try { await getItineraries(); } catch (e) { /* ignore */ }
      alert('Train journey added');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message;
      if (msg === 'No active itinerary selected') alert('No active itinerary selected. Select one in the Dashboard and try again.');
      else alert(msg || 'Failed to add train journey');
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <FaTrain className="dashboard-icon" style={{ fontSize: '64px', marginBottom: '20px' }} />
          <h1>Train Journeys</h1>
          <p>Manage your train journeys</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Train Journey'}</button>
        </div>

        {showForm && (
          <form className="form-card" onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
            <div className="form-row">
              <label>Operator</label>
              <input name="operator" value={form.operator} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>From</label>
              <input name="from" value={form.from} onChange={handleChange} required />
              <label>To</label>
              <input name="to" value={form.to} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Departure Date</label>
              <input name="departureDate" type="date" value={form.departureDate} onChange={handleChange} required />
              <label>Time</label>
              <input name="departureTime" type="time" value={form.departureTime} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Arrival Date</label>
              <input name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} required />
              <label>Time</label>
              <input name="arrivalTime" type="time" value={form.arrivalTime} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Price ({currency})</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Notes</label>
              <input name="notes" value={form.notes} onChange={handleChange} />
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" type="submit">Save Train</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 20 }}>
          <h3>My Train Journeys</h3>
          {loading ? <div>Loading…</div> : (
            <div>
              {trains.length === 0 && <div>No train entries yet</div>}
              {trains.map((t) => (
                <div key={t._id} className="card" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{t.operator}</strong>
                      <div><small>{t.departure.from} → {t.arrival.to}</small></div>
                      <div><small>{new Date(t.departure.date).toLocaleString()} → {new Date(t.arrival.date).toLocaleString()}</small></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{formatCurrency(t.price || 0, currency)}</div>
                      <div><small>{t.notes}</small></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Trains;
