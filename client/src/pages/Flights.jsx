import { useState, useEffect } from 'react';
import { FaPlane, FaPlus } from 'react-icons/fa';
import { getFlights, deleteFlight } from '../services/flightService';
import FlightForm from '../components/FlightForm';
import FlightItem from '../components/FlightItem';
import '../styles/ListPage.css';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const data = await getFlights();
      setFlights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await deleteFlight(id);
        fetchFlights();
      } catch (error) {
        console.error('Error deleting flight:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchFlights();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="page-header">
          <div>
            <FaPlane className="page-icon" />
            <h1>My Flights</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <FaPlus /> Add Flight
          </button>
        </div>

        {showForm && (
          <FlightForm
            item={editingItem}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {flights.length === 0 ? (
          <div className="empty-state">
            <FaPlane className="empty-icon" />
            <p>No flights yet. Add your first flight!</p>
          </div>
        ) : (
          <div className="items-grid">
            {flights.map((item) => (
              <FlightItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flights;

