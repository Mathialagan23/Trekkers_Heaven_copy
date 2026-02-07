import { useState } from 'react';
import { createExpense } from '../services/expenseService';
import { getItineraryCurrency } from '../utils/currency';
import '../styles/FormModal.css';

const QuickExpenseModal = ({ onClose, onAdded, itineraryId }) => {
  const [form, setForm] = useState({ amount: '', category: 'Other', date: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!itineraryId) {
      setError('No active itinerary');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        itinerary: itineraryId,
        amount: Number(form.amount),
        category: form.category,
        date: form.date || new Date(),
        note: form.note
      };
      const res = await createExpense(payload);
      onAdded(res);
      // inform other views to refresh totals for this itinerary
      if (res && res.totals) {
        window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId, totals: res.totals } }));
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Expense</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount ({getItineraryCurrency(itineraryId)}) *</label>
            <input name="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Food</option>
              <option>Stay</option>
              <option>Travel</option>
              <option>Activity</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows="3"></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickExpenseModal;
