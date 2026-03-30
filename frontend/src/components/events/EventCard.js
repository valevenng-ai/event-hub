import React from 'react';
import '../../styles/events.css'

function EventCard({ event, onEdit, onDelete, onClick, admin }) {

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString();

  return (
    <div className="event-card" onClick={() => onClick(event.id)}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <span>{formatDate(event.date)}</span>

      {admin && (
        <div>
          <button onClick={(e) => { e.stopPropagation(); onEdit(event); }}>
            Edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;