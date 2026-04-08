import React from 'react';
import EventCard from './EventCard';

function EventList({ events, loading, error, onEdit, onDelete, onClick, admin }) {
  if (loading) return <p className="state-msg">Chargement...</p>;
  if (error) return <p className="state-msg error">{error}</p>;
  if (events.length === 0) return <p className="state-msg">Aucun événement trouvé.</p>;

  return (
    <div className="events-grid">
      {events.map((event) => (
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