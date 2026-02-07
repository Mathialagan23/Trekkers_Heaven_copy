import { useState, useEffect } from 'react';
import { FaBus, FaPlus } from 'react-icons/fa';
import '../styles/Dashboard.css';
import { getBuses } from '../services/busService';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';
import BusForm from '../components/BusForm';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const activeItineraryId = localStorage.getItem('activeItineraryId');
  const currency = activeItineraryId
    ? getItineraryCurrency(activeItineraryId)
    : 'INR';

  const load = async () => {
    setLoading(true);
    try {
      const data = await getBuses();
      setBuses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    if (!activeItineraryId) {
      alert('Please select an active itinerary first');
      return;
    }
    setEditingItem(null);
    setShowForm(true);
  };

  const openEdit = (bus) => {
    setEditingItem(bus);
    setShowForm(true);
  };

  const handleSuccess = async () => {
    setShowForm(false);
    setEditingItem(null);
    await load();

    if (activeItineraryId) {
      window.dispatchEvent(
        new CustomEvent('itineraryTotalsUpdated', {
          detail: { itineraryId: activeItineraryId }
        })
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <FaBus className="dashboard-icon" style={{ fontSize: 64, marginBottom: 20 }} />
          <h1>Bus Travel</h1>
          <p>Manage your bus journeys</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <button className="btn btn-primary" onClick={openCreate}>
            <FaPlus /> Add Bus
          </button>
        </div>

        {loading ? (
          <div>Loading…</div>
        ) : (
          <div>
            <h3>My Buses</h3>

            {buses.length === 0 && <div>No bus entries yet</div>}

            {buses.map((b) => (
              <div key={b._id} className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{b.company}</strong>
                    <div>
                      <small>
                        {b.departure.from} → {b.arrival.to}
                      </small>
                    </div>
                    <div>
                      <small>
                        {new Date(b.departure.date).toLocaleDateString()} →
                        {new Date(b.arrival.date).toLocaleDateString()}
                      </small>
                    </div>
                    {b.notes && (
                      <div>
                        <small>{b.notes}</small>
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div>
                      {formatCurrency(b.price || 0, currency)}
                    </div>
                    <button
                      className="btn btn-outline btn-small"
                      style={{ marginTop: 6 }}
                      onClick={() => openEdit(b)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <BusForm
            item={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Buses;


// import { useState, useEffect } from 'react';
// import { FaBus } from 'react-icons/fa';
// import '../styles/Dashboard.css';
// import { getBuses, createBus } from '../services/busService';
// import { formatCurrency, getItineraryCurrency } from '../utils/currency';
// import { getItineraries } from '../services/itineraryService';

// const Buses = () => {
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({ company: '', from: '', to: '', departureDate: '', departureTime: '', arrivalDate: '', arrivalTime: '', price: '', notes: '' });
//   const activeItineraryId = localStorage.getItem('activeItineraryId');
//   const currency = activeItineraryId ? getItineraryCurrency(activeItineraryId) : 'USD';

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await getBuses();
//       setBuses(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!activeItineraryId) return alert('Select an active itinerary before adding a bus');
//     try {
//       const payload = {
//         company: form.company,
//         departure: { from: form.from, date: form.departureDate, time: form.departureTime },
//         arrival: { to: form.to, date: form.arrivalDate, time: form.arrivalTime },
//         price: Number(form.price) || 0,
//         notes: form.notes
//       };
//       const res = await createBus(payload);
//       // res may contain { bus, totals }
//       if (res && res.totals) {
//         window.dispatchEvent(new CustomEvent('itineraryTotalsUpdated', { detail: { itineraryId: activeItineraryId, totals: res.totals } }));
//       }
//       setForm({ company: '', from: '', to: '', departureDate: '', departureTime: '', arrivalDate: '', arrivalTime: '', price: '', notes: '' });
//       setShowForm(false);
//       await load();
//       // optionally refresh itineraries for fresh totals
//       try { await getItineraries(); } catch (e) { /* ignore */ }
//       alert('Bus added');
//     } catch (err) {
//       console.error(err);
//       const msg = err?.response?.data?.message;
//       if (msg === 'No active itinerary selected') alert('No active itinerary selected. Select one in the Dashboard and try again.');
//       else alert(msg || 'Failed to add bus');
//     }
//   };

//   return (
//     <div className="dashboard">
//       <div className="container">
//         <div className="dashboard-header">
//           <FaBus className="dashboard-icon" style={{ fontSize: '64px', marginBottom: '20px' }} />
//           <h1>Bus Travel</h1>
//           <p>Manage your bus journeys</p>

          
//         </div>

//         <div style={{ marginBottom: 16 }}>
//           <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : 'Add Bus'}</button>
//         </div>

//         {showForm && (
//           <form className="form-card" onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
//             <div className="form-row">
//               <label>Company</label>
//               <input name="company" value={form.company} onChange={handleChange} required />
//             </div>

//             <div className="form-row">
//               <label>From</label>
//               <input name="from" value={form.from} onChange={handleChange} required />
//               <label>To</label>
//               <input name="to" value={form.to} onChange={handleChange} required />
//             </div>

//             <div className="form-row">
//               <label>Departure Date</label>
//               <input name="departureDate" type="date" value={form.departureDate} onChange={handleChange} required />
//               <label>Time</label>
//               <input name="departureTime" type="time" value={form.departureTime} onChange={handleChange} />
//             </div>

//             <div className="form-row">
//               <label>Arrival Date</label>
//               <input name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} required />
//               <label>Time</label>
//               <input name="arrivalTime" type="time" value={form.arrivalTime} onChange={handleChange} />
//             </div>

//             <div className="form-row">
//               <label>Price ({currency})</label>
//               <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
//             </div>

//             <div className="form-row">
//               <label>Notes</label>
//               <input name="notes" value={form.notes} onChange={handleChange} />
//             </div>

//             <div style={{ marginTop: 12 }}>
//               <button className="btn btn-primary" type="submit">Save Bus</button>
//             </div>
//           </form>
//         )}

//         <div style={{ marginTop: 20 }}>
//           <h3>My Buses</h3>
//           {loading ? <div>Loading…</div> : (
//             <div>
//               {buses.length === 0 && <div>No bus entries yet</div>}
//               {buses.map((b) => (
//                 <div key={b._id} className="card" style={{ marginBottom: 8 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <div>
//                       <strong>{b.company}</strong>
//                       <div><small>{b.departure.from} → {b.arrival.to}</small></div>
//                       <div><small>{new Date(b.departure.date).toLocaleString()} → {new Date(b.arrival.date).toLocaleString()}</small></div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div>{formatCurrency(b.price || 0, currency)}</div>
//                       <div><small>{b.notes}</small></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Buses;

