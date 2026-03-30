import React from 'react';
import EventCard from './EventCard';
import '../../styles/events.css'

function EventList({ events, loading, error, onEdit, onDelete, onClick, admin }) {
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (events.length === 0) return <p>Aucun événement</p>;

  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
          admin={admin}
        />
      ))}
    </div>
  );
}

export default EventList;