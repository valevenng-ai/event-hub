import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/api';
import { isAdmin } from '../store/authStore';
import '../styles/events.css'
import Navbar from '../components/Navbar';
import EventList from '../components/events/EventList';
import EventFilters from '../components/events/EventFilters';
import EventFormModal from '../components/events/EventFormModal';

const EMPTY_FORM = { title: '', description: '', date: '', status: 'active' };

function EventsPage() {
  const navigate = useNavigate();
  const admin = isAdmin();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (filterStatus) filters.status = filterStatus;
        if (filterDate) filters.date = filterDate;

        const res = await getEvents(filters);
        setEvents(res.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filterStatus, filterDate]);

  const openCreate = () => {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date?.slice(0, 16),
      status: event.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSubmit = async () => {
    if (editingEvent) {
      const res = await updateEvent(editingEvent.id, formData);
      setEvents(events.map(e => e.id === editingEvent.id ? res.data : e));
    } else {
      const res = await createEvent(formData);
      setEvents([res.data, ...events]);
    }
    setShowModal(false);
  };

  return (
    <>
      <Navbar />

      <EventFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
      />

      {admin && <button className="btn-primary" onClick={openCreate}>Créer</button>}

      <EventList
        events={events}
        loading={loading}
        error={error}
        onEdit={openEdit}
        onDelete={handleDelete}
        onClick={(id) => navigate(`/events/${id}`)}
        admin={admin}
      />

      <EventFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingEvent={editingEvent}
      />
    </>
  );
}

export default EventsPage;