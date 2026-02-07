import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../services/expenseService';
import QuickExpenseModal from '../components/QuickExpenseModal';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';

const Expenses = () => {
  const { itineraryId } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ totalSpent: 0, budget: 0, remainingBudget: 0 });
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const load = async () => {
    try {
      const res = await getExpenses(itineraryId);
      setExpenses(res.expenses || []);
      setTotals(res.totals || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [itineraryId]);

  const loadTotals = async () => {
    if (!itineraryId) return;
    try {
      const res = await getExpenses(itineraryId);
      setTotals(res.totals || {});
    } catch (err) {
      console.error(err);
    }
  };

  // listen for cross-page events (flight/accommodation/bus auto-create, quick add, etc.)
  useEffect(() => {
    const handler = (e) => {
      const detail = e?.detail || {};
      // only reload when the event is for this itinerary (or no itinerary specified)
      if (!itineraryId) return;
      if (!detail.itineraryId || detail.itineraryId === itineraryId) {
        // reload both list and totals to ensure sync
        load();
      }
    };
    window.addEventListener('itineraryTotalsUpdated', handler);
    return () => window.removeEventListener('itineraryTotalsUpdated', handler);
  }, [itineraryId]);

  // refresh totals when local expenses state changes
  useEffect(() => {
    if (!itineraryId) return;
    loadTotals();
  }, [expenses, itineraryId]);

  // safe polling every 2 seconds to keep totals in sync
  useEffect(() => {
    if (!itineraryId) return;
    const id = setInterval(() => { loadTotals(); }, 2000);
    return () => clearInterval(id);
  }, [itineraryId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(id);
      // reload latest data and totals from server
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20 }}>
        <h2>Expenses</h2>
        <div>
          <button className="btn" onClick={() => navigate('/itineraries')}>Back</button>
          <button className="btn btn-primary" onClick={() => setShowQuickAdd(true)} style={{ marginLeft:10 }}>Add Expense</button>
        </div>
      </div>

      <div style={{ marginTop:16 }}>
        <div><strong>Budget:</strong> {formatCurrency(totals.budget || 0, getItineraryCurrency(itineraryId))}</div>
        <div><strong>Spent:</strong> {formatCurrency(totals.totalSpent || 0, getItineraryCurrency(itineraryId))}</div>
        <div><strong>Remaining:</strong> {formatCurrency(totals.remainingBudget || 0, getItineraryCurrency(itineraryId))}</div>

        <div style={{ marginTop:10 }}>
          <button className="btn" onClick={async () => {
            // export CSV for current itinerary
            const rows = [['Date','Category','Amount','Note']];
            expenses.forEach((e) => rows.push([new Date(e.date).toISOString(), e.category, e.amount, e.note?.replace(/\n/g,' ') || '']));
            const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expenses_${itineraryId || 'export'}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}>Export Expenses</button>
        </div>
      </div>

      <div style={{ marginTop:20 }}>
        {expenses.length === 0 && <div>No expenses yet.</div>}
        {expenses.map((e) => (
          <div key={e._id} style={{ borderBottom:'1px solid #eee', padding:'8px 0', display:'flex', justifyContent:'space-between' }}>
            <div>
              <div><strong>{formatCurrency(e.amount || 0, getItineraryCurrency(itineraryId))}</strong> — {e.category}</div>
              <div style={{ color:'#666', fontSize:13 }}>{ new Date(e.date).toLocaleDateString() } • {e.note}</div>
            </div>
            <div>
              <button className="btn btn-outline" onClick={() => handleDelete(e._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showQuickAdd && (
        <QuickExpenseModal
          itineraryId={itineraryId}
          onClose={() => setShowQuickAdd(false)}
          onAdded={async () => { await load(); }}
        />
      )}
    </div>
  );
};

export default Expenses;
