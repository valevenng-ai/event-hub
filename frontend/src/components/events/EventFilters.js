import React from 'react';
import '../../styles/events.css'

function EventFilters({ filterStatus, setFilterStatus, filterDate, setFilterDate }) {
  return (
    <div>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">Tous</option>
        <option value="active">Actif</option>
        <option value="draft">Brouillon</option>
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
    </div>
  );
}

export default EventFilters;