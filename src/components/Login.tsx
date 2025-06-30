import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

interface LoginModalProps {
  isOpen: boolean;
  onLoggedIn: (loggedIn: boolean) => void;
  onClose: () => void;
}

const Login: React.FC<LoginModalProps> = ({ isOpen, onLoggedIn, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [userName, setUserName] = useState<string>('');
  const [userNameTouched, setUserNameTouched] = useState(false);

  const [password, setPassword] = useState<string>('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isUserNameValid = emailRegex.test(userName);
  const isPasswordValid = password.length > 0;
  const isFormValid = isPasswordValid && isUserNameValid;

  useEffect(() => {
    if (!isOpen) return;

    setUserName('');
    setUserNameTouched(false);
    setPassword('');
    setPasswordTouched(false);
    setSubmitting(false);
  }, [isOpen]);

  const handleSubmit = async () => {
    const userData = {
      username: userName.trim(),
      password,
    };
    try {
      setSubmitting(true);
      const response = await axios.post(config.API_BASE_URL + '/Login/login', userData);
      localStorage.setItem('authToken', JSON.stringify(response.data));
      onLoggedIn(true);
      onClose();
    } catch (error) {
      setSubmitError('Fejl');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#8d4a5b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#c7a6ac',
          padding: '1.5rem',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            backgroundColor: '#8d4a5b',
            padding: '1rem',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          Login
        </h2>

        {/* Email input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email"><strong>Bruger/Email:</strong></label><br />
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onBlur={() => setUserNameTouched(true)}
            placeholder="Indtast bruger/email"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isUserNameValid && userNameTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
            disabled={submitting}
          />
        </div>

        {/* Password input */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password"><strong>Kodeord:</strong></label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Indtast kodeord"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.25rem',
              borderColor: !isPasswordValid && passwordTouched ? 'red' : undefined,
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '1rem',
            }}
            disabled={submitting}
          />
          {!isPasswordValid && passwordTouched && (
            <p style={{ color: 'red', marginTop: '0.25rem' }}>Kodeordet skal angives</p>
          )}
        </div>

        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
              minWidth: '100px',
            }}
          >
            Ok
          </button>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              backgroundColor: !submitting ? '#8d4a5b' : 'grey',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !submitting ? 'pointer' : 'not-allowed',
              minWidth: '100px',
            }}
          >
            Annuller
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
