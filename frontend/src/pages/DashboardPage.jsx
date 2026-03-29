import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, getParticipants, getRegistrations } from '../api/api';
import '../styles/DashboardPage.css';
import Navbar from '../components/Navbar';

function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats]     = useState({ events: 0, participants: 0, registrations: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [eventsRes, participantsRes, registrationsRes] = await Promise.all([
          getEvents(),
          getParticipants(),
          getRegistrations(),
        ]);

        setStats({
          events:        eventsRes.data.length,
          participants:  participantsRes.data.length,
          registrations: registrationsRes.data.length,
        });

        // Les 3 événements les plus récents
        setRecentEvents(eventsRes.data.slice(0, 3));

      } catch (err) {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const getStatusLabel = (status) => {
    const labels = { active: 'Actif', cancelled: 'Annulé', completed: 'Terminé', draft: 'Brouillon' };
    return labels[status] || status;
  };

  if (loading) return <p className="state-msg">Chargement...</p>;
  if (error)   return <p className="state-msg error">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Tableau de bord</h1>
          <p>Bienvenue sur EventHub</p>
        </div>

        {/* Cartes stats */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/events')}>
            <div className="stat-icon"></div>
            <div className="stat-info">
              <span className="stat-number">{stats.events}</span>
              <span className="stat-label">Événements</span>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate('/participants')}>
            <div className="stat-icon"></div>
            <div className="stat-info">
              <span className="stat-number">{stats.participants}</span>
              <span className="stat-label">Participants</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <span className="stat-number">{stats.registrations}</span>
              <span className="stat-label">Inscriptions</span>
            </div>
          </div>
        </div>

        {/* Événements récents */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Événements récents</h2>
            <button className="btn-link" onClick={() => navigate('/events')}>
              Voir tout →
            </button>
          </div>

          {recentEvents.length === 0 ? (
            <p className="empty-msg">Aucun événement pour le moment.</p>
          ) : (
            <div className="recent-events">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="recent-event-row"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="recent-event-info">
                    <span className="recent-event-title">{event.title}</span>
                    <span className="recent-event-date">{formatDate(event.date)}</span>
                  </div>
                  <span className={`status-badge status-${event.status}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      </>
  );
}

export default DashboardPage;