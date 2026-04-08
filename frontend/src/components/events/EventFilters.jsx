import React from 'react';

function EventFilters({
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
}) {
  return (
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
        <button
          className="btn-reset"
          onClick={() => {
            setFilterStatus('');
            setFilterDate('');
          }}
        >
          Réinitialiser
        </button>
      )}

    </div>
  );
}

export default EventFilters;