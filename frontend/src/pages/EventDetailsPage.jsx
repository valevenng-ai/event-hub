import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, deleteEvent, updateEvent, getParticipants, createRegistration, deleteRegistration } from '../api/api';
import { isAdmin } from '../store/authStore';
import '../styles/EventDetailsPage.css';

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = isAdmin();
 
  const [event, setEvent]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
 
  // Modal modification événement
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData]           = useState({});
  const [formError, setFormError]         = useState('');
  const [saving, setSaving]               = useState(false);
 
  // Modal inscription participant
  const [showRegModal, setShowRegModal]   = useState(false);
  const [participants, setParticipants]   = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [regError, setRegError]           = useState('');
  const [registering, setRegistering]     = useState(false);
 
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getEvent(id);
        setEvent(response.data);
      } catch {
        setError("Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
 
  // ── Supprimer événement
  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };
 
  // ── Ouvrir modal modification
  const openEdit = () => {
    setFormData({
      title:       event.title,
      description: event.description,
      date:        event.date?.slice(0, 16),
      status:      event.status,
    });
    setFormError('');
    setShowEditModal(true);
  };
 
  // ── Soumettre modification
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const response = await updateEvent(id, formData);
      setEvent(response.data);
      setShowEditModal(false);
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };
 
  // ── Ouvrir modal inscription
  const openRegModal = async () => {
    setRegError('');
    setSelectedParticipant('');
    try {
      const response = await getParticipants();
      // Exclure les participants déjà inscrits
      const registeredIds = (event.registrations || []).map(r => r.participant.id);
      setParticipants(response.data.filter(p => !registeredIds.includes(p.id)));
    } catch {
      setRegError('Impossible de charger les participants.');
    }
    setShowRegModal(true);
  };
 
  // ── Inscrire un participant
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedParticipant) return;
    setRegError('');
    setRegistering(true);
    try {
      await createRegistration({ participant: selectedParticipant, event: id });
      // Recharge l'événement pour avoir la liste à jour
      const response = await getEvent(id);
      setEvent(response.data);
      setShowRegModal(false);
    } catch (err) {
      setRegError(err.response?.data?.detail || err.response?.data?.[0] || 'Une erreur est survenue.');
    } finally {
      setRegistering(false);
    }
  };
 
  // ── Désinscrire un participant
  const handleUnregister = async (regId) => {
    if (!window.confirm('Désinscrire ce participant ?')) return;
    try {
      await deleteRegistration(regId);
      setEvent({
        ...event,
        registrations: event.registrations.filter(r => r.id !== regId),
      });
    } catch {
      alert('Erreur lors de la désinscription.');
    }
  };
 
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
 
  const getStatusLabel = (status) => ({
    active: 'Actif', cancelled: 'Annulé', completed: 'Terminé', draft: 'Brouillon',
  }[status] || status);
 
  if (loading) return <p className="state-msg">Chargement...</p>;
  if (error)   return <p className="state-msg error">{error}</p>;
  if (!event)  return null;
 
  const registrations = event.registrations || [];
 
  return (
    <div className="detail-page">
 
      <button className="btn-back" onClick={() => navigate('/events')}>← Retour aux événements</button>
 
      {/* Header */}
      <div className="detail-header">
        <div className="detail-header-top">
          <span className={`status-badge status-${event.status}`}>{getStatusLabel(event.status)}</span>
          {admin && (
            <div className="detail-header-actions">
              <button className="btn-edit" onClick={openEdit}>Modifier</button>
              <button className="btn-delete" onClick={handleDelete}>Supprimer</button>
            </div>
          )}
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
 
      {/* Participants */}
      <div className="detail-section">
        <div className="section-header">
          <h2>Participants inscrits</h2>
          <div className="section-header-right">
            <span className="participants-count">
              {registrations.length} inscrit{registrations.length !== 1 ? 's' : ''}
            </span>
            {admin && (
              <button className="btn-primary" onClick={openRegModal}>+ Inscrire</button>
            )}
          </div>
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
                  {new Date(reg.registered_at).toLocaleDateString('fr-FR')}
                </span>
                {admin && (
                  <button className="btn-delete" onClick={() => handleUnregister(reg.id)}>
                    Désinscrire
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* Modal modification événement */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier l'événement</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Titre</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} rows={3}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="datetime-local" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Statut</label>
                <select value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              {formError && <div className="form-error">{formError}</div>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {/* Modal inscription participant */}
      {showRegModal && (
        <div className="modal-overlay" onClick={() => setShowRegModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inscrire un participant</h2>
              <button className="modal-close" onClick={() => setShowRegModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegister} className="modal-form">
              <div className="form-group">
                <label>Participant</label>
                <select value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)} required>
                  <option value="">Sélectionner un participant</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.email}</option>
                  ))}
                </select>
              </div>
              {participants.length === 0 && (
                <p className="empty-msg">Tous les participants sont déjà inscrits.</p>
              )}
              {regError && <div className="form-error">{regError}</div>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRegModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={registering || !selectedParticipant}>
                  {registering ? 'Inscription...' : 'Inscrire'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
    </div>
  );
}

export default EventDetailsPage;