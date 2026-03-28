import React, { useState, useEffect } from 'react';
import { getParticipants } from '../api/api';
import '../styles/ParticipantsPage.css';
import Navbar from '../components/Navbar';

function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      setError('');
      try {
        const filters = {};
        if (search) filters.search = search;
        const response = await getParticipants(filters);
        setParticipants(response.data);
      } catch (err) {
        setError('Impossible de charger les participants.');
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [search]);


  return (
    <>
      <Navbar />
      <div className="participants-page">
        <div className="participants-header">
          <h1>Participants</h1>
          <span className="participants-count">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Recherche */}
        <div className="participants-search">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn-reset" onClick={() => setSearch('')}>
              Effacer
            </button>
          )}
        </div>

        {/* Contenu */}
        {loading && <p className="state-msg">Chargement...</p>}
        {error   && <p className="state-msg error">{error}</p>}

        {!loading && !error && participants.length === 0 && (
          <p className="state-msg">Aucun participant trouvé.</p>
        )}

        {!loading && !error && participants.length > 0 && (
          <div className="participants-list">
            {participants.map((p) => (
              <div key={p.id} className="participant-card">
                <div className="participant-avatar">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="participant-info">
                  <span className="participant-name">{p.name}</span>
                  <span className="participant-email">{p.email}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default ParticipantsPage;