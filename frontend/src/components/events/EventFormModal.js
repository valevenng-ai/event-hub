import React from 'react';
import '../../styles/events.css'

function EventFormModal({ show, onClose, formData, setFormData, onSubmit, editingEvent }) {
  if (!show) return null;

  return (
    <div className="modal">
      <h2>{editingEvent ? 'Modifier' : 'Créer'}</h2>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <button type="submit">Save</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default EventFormModal;