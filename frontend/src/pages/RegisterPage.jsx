import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { setAuth } from '../store/authStore';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password_confirm: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Efface l'erreur du champ modifié
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await register(formData);
      const { token, role, username } = response.data;
      setAuth(token, role, username);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data); // affiche les erreurs champ par champ
      } else {
        setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-header">
          <div className="register-logo">EH</div>
          <h1>EventHub</h1>
          <p>Créer un compte</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username" name="username" type="text"
              value={formData.username} onChange={handleChange}
              placeholder="Choisissez un nom d'utilisateur"
              required autoFocus
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={formData.email} onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              placeholder="8 caractères minimum"
              required
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm">Confirmer le mot de passe</label>
            <input
              id="password_confirm" name="password_confirm" type="password"
              value={formData.password_confirm} onChange={handleChange}
              placeholder="Répétez votre mot de passe"
              required
            />
            {errors.password_confirm && <span className="field-error">{errors.password_confirm}</span>}
          </div>

          {errors.general && <div className="register-error">{errors.general}</div>}

          <div className="register-info">
            Votre compte sera créé avec le rôle <strong>viewer</strong> par défaut.
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <button
            type="button"
            className="register-login-link"
            onClick={() => navigate('/login')}
          >
            Déjà un compte ? Se connecter
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;