import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    isOpen: boolean;
    onLoggedIn: (loggedIn : boolean) => void;
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

    const isPasswordValid = true;

    const isFormValid = isPasswordValid && isUserNameValid;

const navigate = useNavigate();

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
        }

        try {
            const response = await axios.post('http://192.168.8.105:5000/Login/login', userData);

            var token = response.data;
             localStorage.setItem('authToken', token);
           
          //   navigate('/dashboard'); 
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
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: '#8d4a5b',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >

            <div style={{ backgroundColor: '#c7a6ac', padding: '2rem', borderRadius: '8px', minWidth: '500px' }}>
                <h2 style={{ backgroundColor: '#8d4a5b', padding: '2rem', color: 'white', borderRadius: '8px' }} >Login</h2>

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
                        }}
                        disabled={submitting}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="orderNumber"><strong>Kodeord:</strong></label><br />
                    <input
                        id="password"
                        type="text"
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
                        }}
                        disabled={submitting}
                    />
                    {!isPasswordValid && passwordTouched && (
                        <p style={{ color: 'red', marginTop: '0.25rem' }}>Kodeordet skal angives</p>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: isFormValid && !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormValid && !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Ok</button>


                <button
                    onClick={onClose}
                    disabled={submitting}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: !submitting ? '#8d4a5b' : 'grey',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: !submitting ? 'pointer' : 'not-allowed',
                        marginRight: '0.5rem',
                    }}
                > Annuler</button>

            </div>
        </div>
    )
};

export default Login;