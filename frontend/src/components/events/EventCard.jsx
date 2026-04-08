import React from 'react';

function EventCard({ event, onEdit, onDelete, onClick, admin }) {

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getStatusLabel = (status) => ({
    active: 'Actif',
    cancelled: 'Annulé',
    completed: 'Terminé',
    draft: 'Brouillon',
  }[status] || status);

  return (
    <div className="event-card" onClick={() => onClick(event.id)}>

      {/* TOP */}
      <div className="event-card-top">
        <span className={`status-badge status-${event.status}`}>
          {getStatusLabel(event.status)}
        </span>
        <span className="event-date">{formatDate(event.date)}</span>
      </div>

      {/* CONTENT */}
      <h2 className="event-title">{event.title}</h2>
      <p className="event-description">{event.description}</p>

      {/* FOOTER */}
      <div className="event-card-footer">
        {admin ? (
          <div className="event-actions">
            <button
              className="btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
            >
              Modifier
            </button>

            <button
              className="btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
            >
              Supprimer
            </button>
          </div>
        ) : (
          <span className="see-more">Voir les détails →</span>
        )}
      </div>

    </div>
  );
}

export default EventCard;