import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { setAuth } from '../store/authStore';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      const { token, role, username } = response.data;
      setAuth(token, role, username);
      navigate('/');
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">EH</div>
          <h1>EventHub</h1>
          <p>Connectez-vous pour continuer</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username" name="username" type="text"
              value={formData.username} onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              required autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password" name="password" type="password"
              value={formData.password} onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;