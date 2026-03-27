import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/api';
import '../styles/EventsPage.css';

function EventsPage() {
  const navigate = useNavigate();

  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Filtres
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate]     = useState('');

  // Chargement des événements
  useEffect(() => {
    fetchEvents();
  }, [filterStatus, filterDate]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterDate)   filters.date   = filterDate;
      const response = await getEvents(filters);
      setEvents(response.data);
    } catch (err) {
      setError('Impossible de charger les événements.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterStatus('');
    setFilterDate('');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      active:    'Actif',
      cancelled: 'Annulé',
      completed: 'Terminé',
      draft:     'Brouillon',
    };
    return labels[status] || status;
  };

  return (
    <div className="events-page">

      <div className="events-header">
        <h1>Événements</h1>
        <span className="events-count">{events.length} événement{events.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filtres */}
      <div className="events-filters">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="draft">Brouillon</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {(filterStatus || filterDate) && (
          <button className="btn-reset" onClick={resetFilters}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Contenu */}
      {loading && <p className="state-msg">Chargement...</p>}
      {error   && <p className="state-msg error">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="state-msg">Aucun événement trouvé.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="event-card-top">
                <span className={`status-badge status-${event.status}`}>
                  {getStatusLabel(event.status)}
                </span>
                <span className="event-date">{formatDate(event.date)}</span>
              </div>

              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>

              <div className="event-card-footer">
                <span>Voir les détails →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;