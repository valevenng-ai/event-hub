import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../api/api';
import '../styles/EventDetailPage.css';

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getEvent(id);
        setEvent(response.data);
      } catch (err) {
        setError("Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Actif', cancelled: 'Annulé',
      completed: 'Terminé', draft: 'Brouillon',
    };
    return labels[status] || status;
  };

  if (loading) return <p className="state-msg">Chargement...</p>;
  if (error)   return <p className="state-msg error">{error}</p>;
  if (!event)  return null;

  const registrations = event.registrations || [];

  return (
    <div className="detail-page">

      <button className="btn-back" onClick={() => navigate('/events')}>
        ← Retour aux événements
      </button>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-top">
          <span className={`status-badge status-${event.status}`}>
            {getStatusLabel(event.status)}
          </span>
        </div>
        <h1>{event.title}</h1>
        <p className="detail-date">{formatDate(event.date)}</p>
      </div>

      {/* Description */}
      {event.description && (
        <div className="detail-section">
          <h2>Description</h2>
          <p>{event.description}</p>
        </div>
      )}

      {/* Participants inscrits */}
      <div className="detail-section">
        <div className="section-header">
          <h2>Participants inscrits</h2>
          <span className="participants-count">
            {registrations.length} inscrit{registrations.length !== 1 ? 's' : ''}
          </span>
        </div>

        {registrations.length === 0 ? (
          <p className="empty-msg">Aucun participant inscrit pour le moment.</p>
        ) : (
          <div className="participants-list">
            {registrations.map((reg) => (
              <div key={reg.id} className="participant-row">
                <div className="participant-avatar">
                  {reg.participant.name.charAt(0).toUpperCase()}
                </div>
                <div className="participant-info">
                  <span className="participant-name">{reg.participant.name}</span>
                  <span className="participant-email">{reg.participant.email}</span>
                </div>
                <span className="reg-date">
                  Inscrit le {new Date(reg.registered_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default EventDetailPage;