import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/api';
import { isAdmin } from '../store/authStore';
import '../styles/EventsPage.css';
import Navbar from '../components/Navbar';

const EMPTY_FORM = { title: '', description: '', date: '', status: 'active' };
 
function EventsPage() {
  const navigate = useNavigate();
  const admin = isAdmin();
 
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate]     = useState('');
 
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = création
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving]       = useState(false);
 
  useEffect(() => {
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
    fetchEvents();
  }, [filterStatus, filterDate]);
 
  // ── Ouvrir modal création
  const openCreate = () => {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };
 
  // ── Ouvrir modal modification
  const openEdit = (e, event) => {
    e.stopPropagation();
    setEditingEvent(event);
    setFormData({
      title:       event.title,
      description: event.description,
      date:        event.date?.slice(0, 16), // format datetime-local
      status:      event.status,
    });
    setFormError('');
    setShowModal(true);
  };
 
  // ── Supprimer
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(ev => ev.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };
 
  // ── Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingEvent) {
        const response = await updateEvent(editingEvent.id, formData);
        setEvents(events.map(ev => ev.id === editingEvent.id ? response.data : ev));
      } else {
        const response = await createEvent(formData);
        setEvents([response.data, ...events]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };
 
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
 
  const getStatusLabel = (status) => ({
    active: 'Actif', cancelled: 'Annulé', completed: 'Terminé', draft: 'Brouillon',
  }[status] || status);
 
  return (
    <>
      <Navbar/>
      <div className="events-page">
  
        <div className="events-header">
          <div>
            <h1>Événements</h1>
            <span className="events-count">{events.length} événement{events.length !== 1 ? 's' : ''}</span>
          </div>
          {admin && (
            <button className="btn-primary" onClick={openCreate}>+ Créer un événement</button>
          )}
        </div>
  
        {/* Filtres */}
        <div className="events-filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          {(filterStatus || filterDate) && (
            <button className="btn-reset" onClick={() => { setFilterStatus(''); setFilterDate(''); }}>
              Réinitialiser
            </button>
          )}
        </div>
  
        {loading && <p className="state-msg">Chargement...</p>}
        {error   && <p className="state-msg error">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="state-msg">Aucun événement trouvé.</p>
        )}
  
        {!loading && !error && events.length > 0 && (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
                <div className="event-card-top">
                  <span className={`status-badge status-${event.status}`}>{getStatusLabel(event.status)}</span>
                  <span className="event-date">{formatDate(event.date)}</span>
                </div>
                <h2 className="event-title">{event.title}</h2>
                <p className="event-description">{event.description}</p>
                <div className="event-card-footer">
                  {admin ? (
                    <div className="event-actions">
                      <button className="btn-edit" onClick={(e) => openEdit(e, event)}>Modifier</button>
                      <button className="btn-delete" onClick={(e) => handleDelete(e, event.id)}>Supprimer</button>
                    </div>
                  ) : (
                    <span className="see-more">Voir les détails →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
  
        {/* Modal création/modification */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingEvent ? 'Modifier l\'événement' : 'Créer un événement'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
  
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de l'événement"
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de l'événement"
                    rows={3}
                  />
                </div>
  
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Brouillon</option>
                    <option value="active">Actif</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
  
                {formError && <div className="form-error">{formError}</div>}
  
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Enregistrement...' : editingEvent ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
  
      </div>
    </>
  );
}
 
export default EventsPage;