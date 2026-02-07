import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';

const FlightItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="item-card">
      <div className="item-header">
        <h3>{item.airline}</h3>
        <div className="item-actions">
          <button onClick={() => onEdit(item)} className="btn-icon">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(item._id)} className="btn-icon btn-icon-danger">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="item-details">
        <p><strong>From:</strong> {item.departure.airport} - {new Date(item.departure.date).toLocaleDateString()} {item.departure.time}</p>
        <p><strong>To:</strong> {item.arrival.airport} - {new Date(item.arrival.date).toLocaleDateString()} {item.arrival.time}</p>
        {item.price > 0 && <p><strong>Price:</strong> {formatCurrency(item.price || 0, getItineraryCurrency(item.itinerary || item.itineraryId))}</p>}
        {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
      </div>
    </div>
  );
};

export default FlightItem; 
