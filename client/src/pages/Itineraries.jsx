import { useState, useEffect } from 'react';
import { FaRoute, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getItineraries, deleteItinerary } from '../services/itineraryService';
import ItineraryForm from '../components/ItineraryForm';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';
import '../styles/ListPage.css';

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await getItineraries();
      setItineraries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await deleteItinerary(id);
        fetchItineraries();
      } catch (error) {
        console.error('Error deleting itinerary:', error);
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
    fetchItineraries();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="list-page">
      <div className="container">
        <div className="page-header">
          <div>
            <FaRoute className="page-icon" />
            <h1>My Itineraries</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <FaPlus /> Create Itinerary
          </button>
        </div>

        {showForm && (
          <ItineraryForm
            item={editingItem}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {itineraries.length === 0 ? (
          <div className="empty-state">
            <FaRoute className="empty-icon" />
            <p>No itineraries yet. Create your first itinerary!</p>
          </div>
        ) : (
          <div className="items-grid">
            {itineraries.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-header">
                  <h3>{item.title}</h3>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(item)} className="btn-icon">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="btn-icon btn-icon-danger">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="item-details">
                  <p><strong>Destination:</strong> {item.destination}</p>
                  <p><strong>Start Date:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(item.endDate).toLocaleDateString()}</p>
                  {item.description && <p><strong>Description:</strong> {item.description}</p>}
                  {item.flights?.length > 0 && <p><strong>Flights:</strong> {item.flights.length}</p>}
                  {item.accommodations?.length > 0 && <p><strong>Accommodations:</strong> {item.accommodations.length}</p>}
                  <p><strong>Budget:</strong> {formatCurrency(item.budget || 0, getItineraryCurrency(item._id))}</p>
                  <p><strong>Spent:</strong> {formatCurrency(item.totalSpent || 0, getItineraryCurrency(item._id))}</p>
                  {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Itineraries;

