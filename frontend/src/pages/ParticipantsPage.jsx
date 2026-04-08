import React, { useState, useEffect } from 'react';
import { getParticipants, createParticipant, updateParticipant, deleteParticipant } from '../api/api';
import { isAdmin } from '../store/authStore';
import '../styles/ParticipantsPage.css';
import Navbar from '../components/Navbar';

const EMPTY_FORM = { name: '', email: '' };
 
function ParticipantsPage() {
  const admin = isAdmin();
 
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
 
  const [showModal, setShowModal]       = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [formData, setFormData]         = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState('');
  const [saving, setSaving]             = useState(false);
 
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
 
  const openCreate = () => {
    setEditingParticipant(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };
 
  const openEdit = (p) => {
    setEditingParticipant(p);
    setFormData({ name: p.name, email: p.email });
    setFormError('');
    setShowModal(true);
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce participant ?')) return;
    try {
      await deleteParticipant(id);
      setParticipants(participants.filter(p => p.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingParticipant) {
        const response = await updateParticipant(editingParticipant.id, formData);
        setParticipants(participants.map(p => p.id === editingParticipant.id ? response.data : p));
      } else {
        const response = await createParticipant(formData);
        setParticipants([response.data, ...participants]);
      }
      setShowModal(false);
    } catch (err) {
      const data = err.response?.data;
      setFormError(data?.email?.[0] || data?.detail || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
      <Navbar />
      <div className="participants-page">
 
      <div className="participants-header">
        <div>
          <h1>Participants</h1>
          <span className="participants-count">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </span>
        </div>
        {admin && (
          <button className="btn-primary" onClick={openCreate}>+ Ajouter un participant</button>
        )}
      </div>
 
      <div className="participants-search">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button className="btn-reset" onClick={() => setSearch('')}>Effacer</button>}
      </div>
 
      {loading && <p className="state-msg">Chargement...</p>}
      {error   && <p className="state-msg error">{error}</p>}
      {!loading && !error && participants.length === 0 && (
        <p className="state-msg">Aucun participant trouvé.</p>
      )}
 
      {!loading && !error && participants.length > 0 && (
        <div className="participants-list">
          {participants.map((p) => (
            <div key={p.id} className="participant-card">
              <div className="participant-avatar">{p.name.charAt(0).toUpperCase()}</div>
              <div className="participant-info">
                <span className="participant-name">{p.name}</span>
                <span className="participant-email">{p.email}</span>
              </div>
              {admin && (
                <div className="participant-actions">
                  <button className="btn-edit" onClick={() => openEdit(p)}>Modifier</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Supprimer</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
 
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingParticipant ? 'Modifier le participant' : 'Ajouter un participant'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
 
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alice Dupont"
                  required
                />
              </div>
 
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alice@example.com"
                  required
                />
              </div>
 
              {formError && <div className="form-error">{formError}</div>}
 
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : editingParticipant ? 'Modifier' : 'Ajouter'}
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

export default ParticipantsPage;