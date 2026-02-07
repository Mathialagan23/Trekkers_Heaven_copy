import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatCurrency, getItineraryCurrency } from '../utils/currency';

const AccommodationItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="item-card">
      <div className="item-header">
        <h3>{item.name}</h3>
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
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Check-in:</strong> {new Date(item.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> {new Date(item.checkOut).toLocaleDateString()}</p>
        {item.price > 0 && <p><strong>Price:</strong> {formatCurrency(item.price || 0, getItineraryCurrency(item.itinerary || item.itineraryId))}</p>}
        {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
      </div>
    </div>
  );
};

export default AccommodationItem; 
